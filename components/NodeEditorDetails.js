import { useCallback, useRef } from "react";

import { useIsSelectedNode, useNodes, useUpdateNode } from "../context/editor";
import { renderFormControls } from "../utils/filters";
import { styled } from "../style";
import CodeBlock from "./CodeBlock";
import { maybeProps } from "../utils/helpers";

const Container = styled("aside")({
  display: "flex",
  flexDirection: "column",
  minWidth: "sm",
  height: "100%",
  padding: "md",
  backgroundColor: "#ffffffdd",
  overflow: "hidden",
  overflowY: "auto",
});

const Form = styled("form")({});

const Heading = styled("h3")({
  marginBottom: "md",
  "[data-selected] &": {
    color: "primary",
  },
});

const Controls = styled("div")({
  marginBottom: "md",
});

const Inspector = styled(CodeBlock)({
  maxHeight: "xs",
  margin: "-md",
  marginTop: "auto",
});

export default function EditorDetails() {
  const nodes = useNodes();

  return (
    <Container>
      {nodes.map((node) => (
        <NodeDetail key={node.id} node={node} />
      ))}
      <Inspector>{JSON.stringify(nodes, null, 2)}</Inspector>
    </Container>
  );
}

function NodeDetail({ node }) {
  const updateNode = useUpdateNode();
  const isSelected = useIsSelectedNode(node.id);

  const handleChange = useCallback(
    ({ name, value }) => {
      if (node) {
        updateNode({ id: node.id, attributes: [{ name, value }] });
      }
    },
    [node]
  );

  return (
    <Form {...maybeProps({ "data-selected": isSelected })}>
      <Heading>{node.name}</Heading>
      <Controls>
        {renderFormControls(node, { onChange: handleChange })}
      </Controls>
    </Form>
  );
}
