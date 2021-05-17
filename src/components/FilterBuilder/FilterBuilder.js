import { Provider } from "state/editor";
import { styled } from "style";

import NodeEditor from "components/NodeEditor";
// import FilterViewer from "components/FilterViewer";

const Wrapper = styled("div")({
  display: "flex",
  flexFlow: "row nowrap",
  alignItems: "stretch",
  minHeight: "100vh",
});

export default function Editor() {
  return (
    <Provider>
      <Wrapper>
        <NodeEditor />
        {/* <FilterViewer /> */}
      </Wrapper>
    </Provider>
  );
}
