import { extendTheme } from "native-base";

export default extendTheme({
  components: {
    Text: {
      variants: {
        h1: {
          fontWeight: "bold",
          fontSize: "3xl",
          lineHeight: "xs",
        },
        h2: {
          fontWeight: "semibold",
          fontSize: "2xl",
          lineHeight: "xs",
        },
      },
    },
  },
});
