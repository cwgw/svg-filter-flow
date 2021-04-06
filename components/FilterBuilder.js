import FilterNodeEditor from "./FilterNodeEditor";
// import FilterViewer from "./FilterViewer";
import { Provider } from "../context/editor";
import { styled } from "../style";

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
        <FilterNodeEditor />
        {/* <FilterViewer /> */}
      </Wrapper>
    </Provider>
  );
}
