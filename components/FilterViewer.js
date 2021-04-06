import { forwardRef, useEffect, useRef } from "react";

import { uniqueId } from "../utils/helpers";
import { useNodes } from "../context/editor";
import { styled } from "../style";

const Container = styled("div")({
  // flexBasis: "50%",
});

const SVG = styled(
  "svg",
  forwardRef
)({
  display: "block",
  width: "100%",
  height: "100%",
});

export default function EditorViewer() {
  const id = useRef(uniqueId("FILTER"));
  const ref = useRef();
  const resizeObserver = useRef();
  const raf = useRef();
  const nodes = useNodes();

  function renderFilterNodes(nodes) {
    return nodes.map(({ type, id, attributes }) => {
      const Element = type;
      const props = attributes.reduce((acc, { name, value }) => {
        return { ...acc, [name]: value };
      }, {});

      return <Element key={id} {...props} />;
    });
  }

  useEffect(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(handleResize);
    }

    if (ref.current) {
      const el = ref.current;
      resizeObserver.current.observe(el);
      return () => {
        resizeObserver.current.unobserve(el);
      };
    }

    function handleResize() {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }

      raf.current = requestAnimationFrame(() => {
        // force repaint
        raf.current = null;
      });
    }
  }, [ref.current, resizeObserver]);

  return (
    <Container>
      <SVG ref={ref} style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id={id.current}>{renderFilterNodes(nodes)}</filter>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          filter={`url(#${id.current})`}
        />
      </SVG>
    </Container>
  );
}
