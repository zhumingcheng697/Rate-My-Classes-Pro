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
    if let data = data, data.count != 0 {
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
      } else {
        PrimitiveComponent(iconName: "rosette", data: "\(maxUnits) Credit\(maxUnits == 1 ? "" : "s")")
      }
    }
  }
}

fileprivate struct LocationComponent: View {
  let campus: String?
  let location: String?
  
  var body: some View {
    if let campus = campus {
      if let location = location {
        PrimitiveComponent(iconName: "location.fill", data: "\(campus): \(location)")
      } else {
        PrimitiveComponent(iconName: "location.fill", data: campus)
      }
    } else if let location = location {
      PrimitiveComponent(iconName: "location.fill", data: location)
    }
  }
}

fileprivate struct MeetingComponent: View {
  let schedule: [String]?
  
  var body: some View {
    if let schedule = schedule, schedule.count > 0 {
      IconPair(iconName: "clock.fill") {
        VStack(alignment: .leading, spacing: 0) {
          ForEach(schedule, id: \.self) { meeting in
            Text(meeting)
              .font(.body.leading(.tight))
          }
        }
      }
    }
  }
}

struct SectionView: View {
  let fullClassCode: String
  let section: SectionInfo
  @State var schedule: [String]? = nil
  
  func prepend(_ text: String, with prefix: String, seperator: String = ":\n") -> String {
    if text.uppercased().starts(with: prefix.uppercased()) {
      return text
    } else {
      return prefix + seperator + text
    }
  }
  
  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 4) {
        Text("\(fullClassCode) \(section.code)")
          .font(.title3)
          .foregroundColor(.accentColor)
          .fontWeight(.semibold)
          .padding([.horizontal])
        
        LazyVGrid(columns:[.init(.flexible(minimum: 20, maximum: 20), spacing: 12), .init(.flexible(), alignment: .leading)], spacing: 4) {
          
          PrimitiveComponent(iconName: "graduationcap.fill", data: section.instructors?.joined(separator: ", "))
          
          CreditComponent(minUnits: section.minUnits, maxUnits: section.maxUnits)
          
          PrimitiveComponent(iconName: "rectangle.inset.filled.and.person.filled", data: section.type)
          
          PrimitiveComponent(iconName: "flag.2.crossed.fill", data: section.status)
          
          LocationComponent(campus: section.campus, location: section.location)
          
          MeetingComponent(schedule: schedule)
        }
        
        if let notes = section.notes {
          Text(prepend(notes, with: "Notes"))
            .font(.caption.leading(.tight))
            .foregroundColor(.secondary)
        }
        
        if let prereq = section.prerequisites {
          Text(prepend(prereq, with: "Prerequisite"))
            .font(.caption.leading(.tight))
            .foregroundColor(.secondary)
        }
      }
      .navigationTitle(Text(section.code))
      .navigationBarTitleDisplayMode(.inline)
      .padding(.horizontal)
      .onAppear {
        schedule = section.schedule
      }
    }
  }
}

struct SectionView_Previews: PreviewProvider {
  static var previews: some View {
    SectionView(fullClassCode: "CS-UY 2124", section: SectionInfo(
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
