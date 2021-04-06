import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import { animated, useSpring } from "@react-spring/web";

import {
  useDeleteSelectedNode,
  useNodeIds,
  useSetSelectedNode,
  useSetCanvasState,
  useCanvasState,
} from "../context/editor";
import { styled, useTheme } from "../style";
import { keys } from "../utils/keys";
import { clamp } from "../utils/helpers";

import Node from "./Node";
import { maybeProps } from "../utils/helpers";

const defaultProps = {
  scaleMin: 0.25,
  scaleMax: 2,
};

const Container = animated(
  styled(
    "div",
    forwardRef
  )({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "gray.100",
    overflow: "hidden",
    // "&[data-draggable]": {
    //   cursor: "grab",
    // },
    // "&[data-dragging]": {
    //   cursor: "grabbing",
    // },
  })
);

const Grid = styled(
  "canvas",
  forwardRef
)({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const Canvas = animated(
  styled(
    "div",
    forwardRef
  )({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
);

function isBrowser() {
  return typeof window !== "undefined";
}

function useViewportDimensions() {
  const [state, setState] = useState({
    pixelRatio: isBrowser() ? window.devicePixelRatio || 1 : 1,
    width: isBrowser() ? window.innerWidth : 300,
    height: isBrowser() ? window.innerHeight : 150,
  });

  return state;
}

export default function EditorCanvas({ scaleMin, scaleMax }) {
  const nodes = useNodeIds();
  const isMouseIn = useRef(false);
  const setSelectedNode = useSetSelectedNode();
  const deleteSelectedNode = useDeleteSelectedNode();
  const setCanvasState = useSetCanvasState();
  const canvasState = useCanvasState();

  const [{ cursor, scale, translate }, spring] = useSpring(
    () => ({
      cursor: "default",
      scale: canvasState.s,
      translate: [canvasState.x, canvasState.y],
    }),
    [canvasState.s]
  );

  const { setGridRef, updateGrid } = useCanvasGrid({ translate, scale });

  const handleMouseEnter = useCallback(() => {
    isMouseIn.current = true;
    // setMouseIn(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isMouseIn.current = false;
    // setMouseIn(false);
  }, []);

  async function handleDrag(state) {
    const {
      altKey,
      ctrlKey,
      metaKey,
      shiftKey,
      event,
      first,
      last,
      delta: [dx, dy],
      tap,
    } = state;
    if (altKey && !(ctrlKey || metaKey || shiftKey)) {
      const s = scale.get();
      const prev = translate.get();
      const x = prev[0] + dx / s;
      const y = prev[1] + dy / s;

      if (first) {
        spring.start({ cursor: "grabbing", immediate: true });
      } else if (last) {
        spring.start({ cursor: "grab", immediate: true });
        setCanvasState({ x, y });
      }

      spring.start({ translate: [x, y], immediate: true });
      updateGrid({ dx, dy });
    } else if (tap && !isNodeElement(event.target)) {
      setSelectedNode();
    }
  }

  function handleWheel(state) {
    const {
      ctrlKey,
      last,
      delta: [, dy],
    } = state;
    if (ctrlKey) {
      return;
    }

    const prev = scale.get();
    const s = clamp(prev - dy / 1000, scaleMin, scaleMax);
    spring.start({ to: { scale: s }, immediate: true });
    if (s > scaleMin && s < scaleMax) {
      updateGrid({ ds: 1 - dy / 1000 });
    }

    if (last || dy === 0) {
      setCanvasState({ s });
    }
  }

  const bind = useGesture({
    onDrag: handleDrag,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onWheel: handleWheel,
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };

    function handleKeydown(event) {
      if (isMouseIn.current) {
        if (event.key === keys.ALT) {
          if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();
            cursor.set("grab");
          }
        } else {
          cursor.set("default");
        }

        if (event.key === keys.DELETE) {
          event.preventDefault();
          deleteSelectedNode();
        }
      }
    }

    function handleKeyup(event) {
      if (isMouseIn.current && event.key === keys.ALT) {
        event.preventDefault();
        cursor.set("default");
      }
    }
  }, [isMouseIn]);

  return (
    <Container {...bind()} style={{ cursor }}>
      <Grid ref={setGridRef} />
      <Canvas style={{ scale, translate, rotate3d: [0, 0, 0, "0deg"] }}>
        {nodes.map((id) => (
          <Node key={id} id={id} scale={scale} />
        ))}
      </Canvas>
    </Container>
  );
}

EditorCanvas.defaultProps = defaultProps;

function isNodeElement(target) {
  return (
    target.dataset.filterPrimitive || target.closest("[data-filter-primitive]")
  );
}

function useCanvasGrid({ scale, translate }) {
  const { width, height, pixelRatio } = useViewportDimensions();
  const theme = useTheme();
  const state = useRef({});
  const RAF = useRef();

  const handleResize = useCallback(() => {
    const { ctx, ref } = state.current;
    if (ref && ctx) {
      ctx.scale(pixelRatio, pixelRatio);
      ref.style.width = `${width}px`;
      ref.style.height = `${height}px`;
      ref.width = width * pixelRatio;
      ref.height = height * pixelRatio;
    }
  }, []);

  const createPattern = useCallback(
    (ctx) => {
      const _el = document.createElement("canvas");
      const _ctx = _el.getContext("2d");
      _el.width = 16 * pixelRatio;
      _el.height = 16 * pixelRatio;
      _ctx.fillStyle = theme.colors.gray["100"];
      _ctx.strokeStyle = theme.colors.gray["200"];
      _ctx.fillRect(0, 0, _el.width, _el.height);
      _ctx.rect(0, 0, _el.width, _el.height);
      _ctx.stroke();
      return ctx.createPattern(_el, "repeat");
    },
    [theme]
  );

  const draw = useCallback(() => {
    const { ctx, matrix, pattern, ref } = state.current;
    if (ctx) {
      pattern.setTransform(matrix);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, ref.width, ref.height);
    }
  }, []);

  function updateGrid({ dx = 0, dy = 0, ds = 0 }) {
    cancelAnimationFrame(RAF.current);
    RAF.current = requestAnimationFrame(update);

    function update() {
      const { ctx, matrix, pattern, ref } = state.current;
      const s = scale.get();
      // matrix.scaleSelf(ds, ds, width / 2, height / 2);
      // pattern.setTransform(matrix);
      matrix.translateSelf((dx * pixelRatio) / s, (dy * pixelRatio) / s, 0);
      // .scaleSelf(ds, ds, ref.width/2, ref.height/2);
      // .scaleSelf(ds, ds, 0, 0);
      pattern.setTransform(matrix);
      ctx.fillRect(0, 0, ref.width, ref.height);
    }
  }

  const setRef = useCallback(
    (el) => {
      if (el) {
        const [x, y] = translate.get();
        const s = scale.get();
        const ctx = el.getContext("2d", { alpha: false });
        const pattern = createPattern(ctx);
        const matrix = new DOMMatrix([
          s,
          0,
          0,
          s,
          x * s * pixelRatio,
          y * s * pixelRatio,
        ]);
        state.current = { ref: el, ctx, pattern, matrix };
        handleResize();
        draw();
      }
    },
    [handleResize, draw]
  );

  return {
    setGridRef: setRef,
    updateGrid,
  };
}
