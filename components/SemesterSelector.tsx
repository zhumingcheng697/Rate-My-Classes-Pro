import React, { useMemo } from "react";
import { Select, type ISelectProps, Icon } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import Semester from "../libs/semester";

type SemesterOptionRecord = Record<string, Semester>;

type SemesterSelectorBaseProps = {
  selectedSemester?: Semester;
  semesterOptions: Semester[];
  onSelectedSemesterChange: (semester: Semester) => void;
};

export type SemesterSelectorProps = SemesterSelectorBaseProps &
  Omit<ISelectProps, keyof SemesterSelectorBaseProps>;

export default function SemesterSelector({
  selectedSemester,
  semesterOptions,
  onSelectedSemesterChange,
  ...rest
}: SemesterSelectorProps) {
  const semesterOptionsRecord = useMemo(() => {
    const record: SemesterOptionRecord = {};
    for (let semester of semesterOptions) {
      record[semester.toString()] = semester;
    }
    return record;
  }, [semesterOptions]);

  return (
    <Select
      {...rest}
      selectedValue={selectedSemester?.toString()}
      onValueChange={(semesterName) => {
        onSelectedSemesterChange(semesterOptionsRecord[semesterName]);
      }}
      _selectedItem={{
        endIcon: <Icon color={"nyu"} as={<Ionicons name={"checkmark"} />} />,
      }}
    >
      {Object.keys(semesterOptionsRecord).map((semesterName) => (
        <Select.Item
          key={semesterName}
          label={semesterName}
          value={semesterName}
        />
      ))}
    </Select>
  );
}
