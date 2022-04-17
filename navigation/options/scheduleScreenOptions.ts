import { useSelector } from "react-redux";
import { type StackNavigationOptions } from "@react-navigation/stack";

import Semester from "../../libs/semester";

export default (): StackNavigationOptions => {
  const { selectedSemester } = useSelector((state) => state.settings);
  return {
    headerBackTitle: "Back",
    title: `${new Semester(selectedSemester).toString()} Schedule`,
  };
};
