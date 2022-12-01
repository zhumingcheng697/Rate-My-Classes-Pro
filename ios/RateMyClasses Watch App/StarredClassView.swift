//
//  StarredClassView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/29/22.
//

import SwiftUI

struct StarredClassView: View {
  @EnvironmentObject var contextModel: ContextModel
  @State var isLoadingSchedule = true
  @State var schedules: [SectionInfo]? = nil
  @State var timer: Timer? = nil
  let starredClass: StarredClass
  
  func fetchSections(selectedSemester: Semester? = nil) {
    if let timer = timer {
      timer.invalidate()
    }
    
    timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: false) { _ in
      Task {
        isLoadingSchedule = true
        schedules = await Schedge.getSchedule(
          classInfo: starredClass,
          selectedSemester: selectedSemester ?? contextModel.context.selectedSemester)
        isLoadingSchedule = false
      }
    }
  }
  
  var body: some View {
    let currentSemesterName = contextModel.context.selectedSemester.name
    
    return ScrollView {
      VStack(alignment: .leading, spacing: 2) {
        Text(starredClass.name)
          .font(.title3)
          .foregroundColor(.accentColor)
          .fontWeight(.semibold)
          .padding([.horizontal])
        
        Text(starredClass.fullClassCode)
          .font(.callout)
          .fontWeight(.medium)
          .padding([.horizontal])
        
        NavigationLink(destination: {
          ScheduleView(sections: $schedules, isLoading: $isLoadingSchedule, classInfo: starredClass)
        }) {
          if isLoadingSchedule {
            ProgressView()
          } else {
            Text(schedules == nil
                 ? "Unable to Load \(currentSemesterName) Schedule"
                 : schedules?.count == 0
                 ? "Not Offered in \(currentSemesterName)"
                 : "\(currentSemesterName) Schedule")
          }
        }
        .disabled((!isLoadingSchedule && schedules != nil && schedules?.count != 0) ? false : true)
        .padding(.vertical, 6)
        
        Text(starredClass.description)
          .font(.caption)
          .padding([.horizontal])
      }
    }
    .onAppear {
      if (schedules == nil) {
        fetchSections()
      }
    }
    .onChange(of: contextModel.context.selectedSemester) {
      fetchSections(selectedSemester: $0)
    }
    .navigationTitle(Text(starredClass.fullClassCode))
    .navigationBarTitleDisplayMode(.inline)
  }
}

struct StarredClassView_Previews: PreviewProvider {
  static var previews: some View {
    StarredClassView(starredClass: StarredClass(
      schoolCode: "UY",
      departmentCode: "CS",
      classNumber: "2124",
      name: "Object Oriented Programming",
      description: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
      starredDate: 0))
    .environmentObject(ContextModel())
  }
}
