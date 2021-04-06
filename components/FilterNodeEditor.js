import { styled } from "../style";

import NodeEditorCanvas from "./NodeEditorCanvas";
import NodeEditorDetails from "./NodeEditorDetails";
import NodeEditorMenu from "./NodeEditorMenu";

const Container = styled("div")({
  position: "relative",
  width: "100%",
  height: "100vh",
});

const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  padding: "md",
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "auto",
  },
});

export default function FilterNodeEditor() {
  return (
    <Container>
      <NodeEditorCanvas />
      <Overlay>
        <NodeEditorDetails />
        <NodeEditorMenu />
      </Overlay>
    </Container>
  );
}
