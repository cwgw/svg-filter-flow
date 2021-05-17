import { styled } from "style";

const Pre = styled("pre")({
  padding: "sm",
  backgroundColor: "gray.800",
  color: "background",
  overflow: "auto",
});

export default function CodeBlock({ children, ...props }) {
  return <Pre {...props}>{children}</Pre>;
}
