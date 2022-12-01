//
//  ScheduleView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct ScheduleView: View {
  @EnvironmentObject var contextModel: ContextModel
  @Binding var sections: [SectionInfo]?
  @Binding var isLoading: Bool
  let classInfo: ClassInfo
  
  var diff: Int {
    return contextModel.context.selectedSemester - Semester.predictCurrentSemester()
  }
  
  var body: some View {
    Section {
      if isLoading {
        ProgressView()
      } else if let sections = sections {
        if sections.count != 0 {
          ScrollView {
            VStack(alignment: .leading) {
              Text(contextModel.context.selectedSemester.name)
                .font(.title3)
                .foregroundColor(.accentColor)
                .fontWeight(.semibold)
                .padding(.horizontal)
              
              ForEach(sections, id: \.code) { section in
                NavigationLink("\(classInfo.fullClassCode) \(section.code)") {
                  SectionView(fullClassCode: classInfo.fullClassCode, section: section)
                }.buttonBorderShape(.roundedRectangle)
              }
            }
          }
        } else {
          ErrorView(iconName: "calendar.badge.exclamationmark", title: "Not Offered", message: "\(classInfo.fullClassCode) \(diff > 0 ? "will not be" : diff < 0 ? "was not" : "is not") offered in \(contextModel.context.selectedSemester.name)")
            .padding(.horizontal)
        }
      } else {
        ErrorView(iconName: "antenna.radiowaves.left.and.right", title: "Unable to Load Schedule", message: "Unable to load \(contextModel.context.selectedSemester.name) schedule for \(classInfo.fullClassCode)")
          .padding(.horizontal)
      }
    }
    .navigationTitle(Text("Schedule"))
    .navigationBarTitleDisplayMode(.inline)
  }
}

struct ScheduleView_Previews: PreviewProvider {
  static var previews: some View {
    ScheduleView(
      sections: Binding(get: { Array(repeating: SectionInfo(
        code: "A",
        instructors: ["John Apple"],
        type: "Lecture",
        status: "Open",
        meetings: [
          SectionInfo.Meeting(beginDate: "2023-01-23T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
          SectionInfo.Meeting(beginDate: "2023-01-25T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
          SectionInfo.Meeting(beginDate: "2023-01-27T13:00:00Z", minutesDuration: 170, endDate: "2023-05-09T03:59:00Z")
        ],
        name: "Test Section",
        campus: "Tandon",
        minUnits: 4,
        maxUnits: 4,
        location: "370J 310",
        notes: "Some notes",
        prerequisites: "Some prerequisites",
        recitations: [
          SectionInfo(
            code: "A",
            instructors: ["John Apple"],
            type: "Lecture",
            status: "Open",
            meetings: [
              SectionInfo.Meeting(beginDate: "2023-01-23T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
              SectionInfo.Meeting(beginDate: "2023-01-25T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
              SectionInfo.Meeting(beginDate: "2023-01-27T13:00:00Z", minutesDuration: 170, endDate: "2023-05-09T03:59:00Z")
            ],
            name: "Object Oriented Programming",
            campus: "Tandon",
            minUnits: 4,
            maxUnits: 4,
            location: "370J 310",
            notes: "Some notes",
            prerequisites: "Some prerequisites",
            recitations: nil)
        ]), count: 4) }, set: { _, _ in }),
      isLoading: Binding(get: { false }, set: { _, _ in }),
      classInfo: StarredClass(
        schoolCode: "UY",
        departmentCode: "CS",
        classNumber: "2124",
        name: "Object Oriented Programming",
        description: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
        starredDate: 0))
    .environmentObject(ContextModel())
  }
}
