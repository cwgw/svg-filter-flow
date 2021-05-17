import { useCallback } from "react";
import { useGesture } from "react-use-gesture";
import { animated, useSpring } from "@react-spring/web";

import {
  useIsSelectedNode,
  useNode,
  useSetSelectedNode,
  useUpdateNode,
} from "state/editor";
import { get, styled } from "style";

const Container = animated(
  styled("div")(({ theme }) => ({
    position: "relative",
    maxWidth: "288px",
    marginBottom: 3,
    paddingY: 3,
    paddingX: 4,
    backgroundColor: "background",
    borderRadius: "md",
    userSelect: "none",
    "&[data-selected]": {
      boxShadow: `0 0 0 2px ${get(theme, "colors.primary")}`,
      zIndex: 1,
    },
  }))
);

export default function Node({ id, scale }) {
  const selectNode = useSetSelectedNode();
  const isSelected = useIsSelectedNode(id);
  const { name, position = [] } = useNode(id);
  const updateNode = useUpdateNode();

  const handleMouseDown = useCallback(() => {
    if (!isSelected) {
      selectNode(id);
    }
  }, [id, isSelected, selectNode]);

  const [style, spring] = useSpring(
    () => ({
      translate3d: [position[0], position[1], 0],
    }),
    [id, position]
  );

  const bind = useGesture({
    onMouseDown: handleMouseDown,
    onDrag: (state) => {
      const {
        delta: [dx, dy],
        last,
        tap,
      } = state;
      if (isSelected && !tap) {
        const prev = style.translate3d.get();
        const s = scale.get();
        const x = dx / s + prev[0];
        const y = dy / s + prev[1];
        spring.start({ translate3d: [x, y, 0], immediate: true });

        if (last) {
          updateNode({ id, position: [x, y] });
        }
      }
    },
  });

  return (
    <Container
      data-filter-primitive={name}
      data-selected={isSelected || undefined}
      id={id}
      style={style}
      {...bind()}
    >
      <h3>{name}</h3>
    </Container>
  );
}
