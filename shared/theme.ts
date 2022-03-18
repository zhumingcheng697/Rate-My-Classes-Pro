import { extendTheme } from "native-base";

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

export default extendTheme({
  components: {
    ScrollView: {
      baseStyle: {
        background: "white",
        minHeight: "full",
        paddingY: "10px",
      },
    },
    Text: {
      variants: {
        h1: {
          fontWeight: "bold",
          fontSize: "3xl",
          ...headerBaseStyle,
        },
        h2: {
          fontWeight: "semibold",
          fontSize: "2xl",
          ...headerBaseStyle,
        },
      },
    },
  },
});
