import { extendTheme } from "native-base";

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

export default extendTheme({
  components: {
    Skeleton: {
      baseStyle: {
        startColor: "#f2f2f7",
      },
    },
    ScrollView: {
      baseStyle: {
        background: "white",
        minHeight: "full",
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
