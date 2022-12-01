//
//  SectionView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct SectionView: View {
  let classInfo: ClassInfo
  let section: SectionInfo
  @State var schedule: [String]? = nil
  
  var body: some View {
    VStack(alignment: .leading) {
      Text("\(section.name ?? classInfo.name) ")
        .font(.callout)
        .fontWeight(.medium)
      +
      Text("(\(classInfo.fullClassCode) \(section.code))")
        .font(.callout)
      
      LazyVGrid(columns:[.init(.flexible(minimum: 20, maximum: 20), spacing: 12), .init(.flexible(), alignment: .leading)], spacing: 4) {
        if let instructors = section.instructors, instructors.count != 0 {
          IconPair(iconName: "graduationcap.fill") { Text(instructors.joined(separator: ", "))
          }
        }
        
        if let maxUnits = section.maxUnits {
          if let minUnites = section.minUnits, minUnites > 0 && minUnites != maxUnits {
            IconPair(iconName: "rosette") {
              Text("\(minUnites)–\(maxUnits) Credits")
            }
          } else {
            IconPair(iconName: "rosette") {
              Text("\(maxUnits) Credit\(maxUnits == 1 ? "" : "s")")
            }
          }
        }
        
        if let type = section.type {
          IconPair(iconName: "rectangle.inset.filled.and.person.filled") {
            Text(type)
          }
        }
        
        if let status = section.stauts {
          IconPair(iconName: "flag.2.crossed.fill") {
            Text(status)
          }
        }
        
        if let campus = section.campus {
          if let location = section.location {
            IconPair(iconName: "location.fill") {
              Text("\(campus): \(location)")
            }
          } else {
            IconPair(iconName: "location.fill") {
              Text(campus)
            }
          }
        } else if let location = section.location {
          IconPair(iconName: "location.fill") {
            Text(location)
          }
        }
        
        if let schedule = schedule, schedule.count > 0 {
          IconPair(iconName: "clock.fill") {
            VStack(alignment: .leading, spacing: 0) {
              ForEach(schedule, id: \.self) { meeting in
                Text(meeting)
                  .font(Font.body.leading(.tight))
              }
            }
          }
        }
      }
    }
    .padding()
    .onAppear {
      schedule = section.schedule
    }
  }
}

struct SectionView_Previews: PreviewProvider {
  static var previews: some View {
    SectionView(classInfo: StarredClass(
      schoolCode: "UY",
      departmentCode: "CS",
      classNumber: "2124",
      name: "Object Oriented Programming",
      description: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
      starredDate: 0
    ), section: SectionInfo(
      code: "A",
      instructors: ["John Apple"],
      type: "Lecture",
      stauts: "Open",
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
          stauts: "Open",
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
      ]))
  }
}
