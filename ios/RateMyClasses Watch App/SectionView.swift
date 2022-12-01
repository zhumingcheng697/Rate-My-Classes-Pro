//
//  SectionView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI
import RegexBuilder

fileprivate struct PrimitiveComponent: View {
  let iconName: String
  let data: String?
  
  var body: some View {
    if let data = data, data.count > 0 {
      IconPair(iconName: iconName) {
        Text(data)
      }
    }
  }
}

fileprivate struct CreditComponent: View {
  let minUnits: Int?
  let maxUnits: Int?
  
  var body: some View {
    if let maxUnits = maxUnits {
      if let minUnits = minUnits, minUnits > 0 && minUnits != maxUnits {
        PrimitiveComponent(iconName: "rosette", data: "\(minUnits)–\(maxUnits) Credits")
      } else if maxUnits > 0 {
        PrimitiveComponent(iconName: "rosette", data: "\(maxUnits) Credit\(maxUnits == 1 ? "" : "s")")
      }
    }
  }
}

fileprivate struct LocationComponent: View {
  let campus: String?
  let location: String?
  
  var body: some View {
    if let campus = campus, campus.count > 0 {
      if let location = location, location.count > 0 {
        IconPair(iconName: "location.fill") {
          VStack(alignment: .leading) {
            Text(campus)
              .font(.body.leading(.tight))
            Text(location)
              .font(.caption2.leading(.tight))
              .fontWeight(.medium)
          }
        }
      } else {
        PrimitiveComponent(iconName: "location.fill", data: campus)
      }
    } else if let location = location {
      PrimitiveComponent(iconName: "location.fill", data: location)
    }
  }
}

fileprivate struct MeetingComponent: View {
  let schedule: [(String, String)]?
  
  var body: some View {
    if let schedule = schedule, schedule.count > 0 {
      IconPair(iconName: "clock.fill") {
        VStack(alignment: .leading, spacing: 0) {
          ForEach(schedule.indices, id: \.self) { i in
            VStack(alignment: .leading) {
              Text(schedule[i].0)
                .font(.body.leading(.tight))
              Text(schedule[i].1)
                .font(.caption2.leading(.tight))
                .fontWeight(.medium)
            }
          }
        }
      }
    }
  }
}

struct SectionView: View {
  let classInfo: ClassInfo
  let section: SectionInfo
  @State var schedule: [(String, String)]? = nil
  
  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 5) {
        if let name = section.name,
           name != classInfo.name {
          Text(name)
            .font(.title3)
            .foregroundColor(.accentColor)
            .fontWeight(.semibold)
        } else {
          Text("\(classInfo.fullClassCode) \(section.code)")
            .font(.title3)
            .foregroundColor(.accentColor)
            .fontWeight(.semibold)
        }
        
        LazyVGrid(columns:[.init(.flexible(minimum: 20, maximum: 20), spacing: 12), .init(.flexible(), alignment: .leading)], spacing: 5) {
          
          PrimitiveComponent(iconName: "graduationcap.fill", data: section.instructors?.joined(separator: ", "))
          
          CreditComponent(minUnits: section.minUnits, maxUnits: section.maxUnits)
          
          PrimitiveComponent(iconName: "rectangle.inset.filled.and.person.filled", data: section.type)
          
          PrimitiveComponent(iconName: "flag.2.crossed.fill", data: section.status)
          
          LocationComponent(campus: section.campus, location: section.location)
          
          MeetingComponent(schedule: schedule)
        }
        
        if let notes = section.notes, notes.count > 0 {
          VStack(alignment: .leading) {
            Text("Notes:")
            Text(notes)
              .font(.caption2.leading(.tight))
          }
          .font(.caption.leading(.tight))
          .foregroundColor(.secondary)
        }
        
        if let prereq = section.prerequisites {
          VStack(alignment: .leading) {
            Text("Prerequisites:")
            Text(prereq)
              .font(.caption2.leading(.tight))
          }
          .foregroundColor(.secondary)
        }
      }
      .navigationTitle(Text(section.code))
      .navigationBarTitleDisplayMode(.inline)
      .padding(.horizontal)
      .onAppear {
        if (schedule == nil) {
          schedule = section.schedule
        }
      }
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
      ]))
  }
}
