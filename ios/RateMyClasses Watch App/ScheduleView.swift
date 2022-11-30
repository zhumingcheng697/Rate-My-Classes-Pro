//
//  ScheduleView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct ScheduleView: View {
  @EnvironmentObject var contextModel: ContextModel
  @Binding var schedules: [SectionInfo]?
  @Binding var isLoading: Bool
  let classInfo: ClassInfo

  var body: some View {
    Section {
      if isLoading {
        ProgressView()
      } else if let schedules = schedules {
        if schedules.count != 0 {
          ScrollView {
            
          }
        } else {
          ErrorView(iconName: "calendar.badge.exclamationmark", title: "Not Offered", message: "\(classInfo.fullClassCode) is not offered in \(contextModel.context.selectedSemester.name)")
            .padding(.horizontal)
        }
      } else {
        ErrorView(iconName: "antenna.radiowaves.left.and.right.slash", title: "Unable to Load Schedule", message: "Unable to load \(contextModel.context.selectedSemester.name) schedule for \(classInfo.fullClassCode)")
          .padding(.horizontal)
      }
    }.navigationTitle(Text("Schedule"))
  }
}

struct ScheduleView_Previews: PreviewProvider {
  static var previews: some View {
    ScheduleView(
      schedules: Binding(get: { [] }, set: { _, _ in }),
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
