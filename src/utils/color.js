import convert from "color-convert";

import { clamp, round } from "./helpers";
import { NAMED_COLORS } from "../constants/colors";

const matchColorString = (() => {
  const NUM = "\\d+(?:\\.\\d+)?";
  const HEX_NUM = "[0-9a-fA-F]";
  const HSL = `^\\s*hsla?[\\(|\\s]+(?<h>${NUM})[,|\\s]+(?<s>${NUM})%[,|\\s]+(?<l>${NUM})%(?:[,|\\s]+(?<a>${NUM}))?[\\)|\\s]+?`;
  const RGB = `^\\s*rgba?[\\(|\\s]+(?<r>${NUM})[,|\\s]+(?<g>${NUM})[,|\\s]+(?<b>${NUM})(?:[,|\\s]+\\k<a>)?[\\)|\\s]+?`;
  const HEX = `^#?(?<hex>${HEX_NUM}{8}|${HEX_NUM}{6}|${HEX_NUM}{4}|${HEX_NUM}{3})`;
  return new RegExp(`(?<rgb>${RGB})|(?<hsl>${HSL})|(?:${HEX})`);
})();

export class Color {
  constructor(input) {
    if (input instanceof Color) {
      Object.assign(this, input);
      return;
    }

    const color = parseColorString(input);
    if (color) {
      const [r, g, b, a] = color;
      this.raw = [r, g, b];
      this.a = a;
    } else {
      this.raw = [0, 0, 0];
      this.a = 1;
    }

    this.update();
  }

  set(key, value) {
    if (typeof value === "object") {
      for (const k in value) {
        this[key][k] = value[k];
      }
    } else {
      this[key] = value;
    }

    if (key === "hsv") {
      this.raw = convert.hsv.rgb.raw(this.hsv.h, this.hsv.s, this.hsv.v);
    }

    if (key === "hsl") {
      this.raw = convert.hsl.rgb.raw(this.hsl.h, this.hsl.s, this.hsl.l);
    }

    if (key === "rgb") {
      this.raw = [this.rgb.r, this.rgb.g, this.rgb.b];
    }

    this.update();
  }

  update() {
    const hsl = convert.rgb.hsl(this.raw);
    const hsv = convert.rgb.hsv(this.raw);
    const rgb = roundArray(this.raw);
    const hex = convert.rgb.hex(this.raw);
    const hexAlpha = ((this.a * 255) & 0xff).toString(16).toUpperCase();
    this.hsl = { h: hsl[0], s: hsl[1], l: hsl[2] };
    this.hsv = { h: hsv[0], s: hsv[1], v: hsv[2] };
    this.rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
    this.hex = this.a === 1 ? hex : `${hex}${hexAlpha}`;
  }

  toString(mode) {
    switch (mode) {
      case "rgb": {
        const { r, g, b } = this.rgb;
        return this.a < 1
          ? `rgba(${r}, ${g}, ${b}, ${this.a})`
          : `rgb(${r}, ${g}, ${b})`;
      }
      case "hsl": {
        const { h, s, l } = this.hsl;
        return this.a < 1
          ? `hsla(${h}, ${s}%, ${l}%, ${this.a})`
          : `hsl(${h}, ${s}%, ${l}%)`;
      }
      case "hex":
      default: {
        return `#${this.hex}`;
      }
    }
  }
}

function roundArray(arr, precision) {
  if (!Array.isArray(arr)) {
    return arr;
  }

  return arr.map((n) => round(n, precision));
}

export function parseColorString(str) {
  if (typeof str !== "string") {
    console.warn(
      `Color.parseColorString() expected a string, got "${typeof str}"`
    );
    return;
  }

  if (NAMED_COLORS[str.toLowerCase()]) {
    return convert.keyword.rgb.raw(str).concat(1);
  }

  if (/^\s*transparent\s*$/i.test(str)) {
    return [0, 0, 0, 0];
  }

  const m = str.match(matchColorString);

  if (m) {
    const a = !isNaN(Number(m.groups.a)) ? Number(m.groups.a) : 1;
    if (m.groups.rgb) {
      return [
        clamp(Number(m.groups.r), 0, 255),
        clamp(Number(m.groups.g), 0, 255),
        clamp(Number(m.groups.b), 0, 255),
        a,
      ];
    } else if (m.groups.hsl) {
      return convert.hsl.rgb
        .raw(Number(m.groups.h), Number(m.groups.s), Number(m.groups.l))
        .concat(a);
    } else if (m.groups.hex) {
      return convert.hex.rgb.raw(m.groups.hex).concat(a);
    }
  }
}

export function formatColorString(str, mode) {
  let color = str;
  if (typeof color === "string") {
    color = parseColorString(str);
  }

  if (!Array.isArray(color)) {
    console.warn("Couldn't format color string", str);
    return str;
  }

  const [r, g, b, a] = color;

  switch (mode) {
    case "hex": {
      const hex = convert.rgb.hex(r, g, b);
      const alpha = ((a * 255) & 0xff).toString(16).toUpperCase();
      return a < 1 ? `#${hex}${alpha}` : `#${hex}`;
    }
    case "hsl": {
      const [h, s, l] = convert.rgb.hsl(r, g, b);
      return a < 1
        ? `hsla(${round(h)}, ${round(s)}%, ${round(l)}%, ${a})`
        : `hsl(${round(h)}, ${round(s)}%, ${round(l)}%)`;
    }
    case "rgb":
    default: {
      return a < 1
        ? `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a})`
        : `rgb(${round(r)}, ${round(g)}, ${round(b)})`;
    }
  }
}
