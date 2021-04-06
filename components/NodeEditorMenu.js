import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  useCanvasState,
  useCreateNode,
  useDeleteNode,
  useSelectedNode,
  useSetCanvasState,
} from "../context/editor";
import { filterPrimitiveTypes } from "../utils/filters";
import { styled } from "../style";

import ComboboxButton from "./ComboboxButton";
import Button from "./Button";
import Icon from "./Icon";
import MenuButton from "./MenuButton";
import { round } from "../utils/helpers";

const Container = styled("div")({
  display: "flex",
  "& > *:not(:last-child)": {
    marginRight: "sm",
  },
});

const Span = styled("span")({
  padding: "sm",
});

export default function EditorMenu() {
  const addNode = useCreateNode();
  const deleteNode = useDeleteNode();
  const selectedNode = useSelectedNode();
  const [label, setLabel] = useState("Add Node");
  const timeout = useRef();

  const handleAddNode = useCallback(
    (value) => {
      addNode({ type: value });
      setLabel("✓ Added");
      timeout.current = setTimeout(() => {
        setLabel("Add Node");
      }, 2000);
    },
    [addNode, setLabel]
  );

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  }, [deleteNode, selectedNode]);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  return (
    <Container>
      <ZoomControl />
      <ComboboxButton
        variant="button"
        label={
          <Fragment>
            <Icon icon="plus" />
            &thinsp;
            {label}
          </Fragment>
        }
        name="add-node"
        onChange={handleAddNode}
        options={filterPrimitiveTypes}
        position="left bottom"
      />
      <Button
        onClick={handleDeleteNode}
        title="Delete node"
        disabled={!selectedNode}
      >
        <Icon icon="x" />
        &thinsp;
        {"Delete Node"}
      </Button>
    </Container>
  );
}

function ZoomControl() {
  const canvas = useCanvasState();
  const setCanvasState = useSetCanvasState();
  const handleChange = useCallback((value) => {
    const s = Number(value.slice(0, -1)) / 100;
    setCanvasState({ s });
  }, []);
  return (
    <MenuButton
      onChange={handleChange}
      options={["25%", "50%", "75%", "100%", "125%", "150%", "200%"]}
    >
      {round(100 * canvas.s)}%
    </MenuButton>
  );
}
