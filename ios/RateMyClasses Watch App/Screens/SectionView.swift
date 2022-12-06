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
          .font(.body.leading(.tight))
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
        VStack(alignment: .leading, spacing: 2) {
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
            .padding(.horizontal)
        } else {
          Text("\(classInfo.fullClassCode) \(section.code)")
            .font(.title3)
            .foregroundColor(.accentColor)
            .fontWeight(.semibold)
            .padding(.horizontal)
        }
        
        LazyVGrid(columns:[.init(.flexible(minimum: 20, maximum: 20), spacing: 12), .init(.flexible(), alignment: .leading)], spacing: 6) {
          
          PrimitiveComponent(iconName: "graduationcap.fill", data: section.instructors?.joined(separator: ", "))
          
          CreditComponent(minUnits: section.minUnits, maxUnits: section.maxUnits)
          
          PrimitiveComponent(iconName: "rectangle.inset.filled.and.person.filled", data: section.type)
          
          PrimitiveComponent(iconName: "flag.2.crossed.fill", data: section.status)
          
          LocationComponent(campus: section.campus, location: section.location)
          
          MeetingComponent(schedule: schedule)
        }
        .padding((section.notes != nil && section.notes?.count != 0) ||
                 (section.prerequisites != nil && section.prerequisites?.count != 0) ? [.bottom, .horizontal] : [.horizontal])
        
        if let notes = section.notes, notes.count > 0 {
          ReadMoreView(title: "Notes", text: notes)
        }
        
        if let prereq = section.prerequisites {
          ReadMoreView(title: "Prerequisites", text: prereq)
        }
      }
      .navigationTitle(Text(section.code))
      .navigationBarTitleDisplayMode(.inline)
      .onAppear {
        if (schedule == nil) {
          schedule = section.schedule
        }
      }
    }
  }
}

#if DEBUG
struct SectionView_Previews: PreviewProvider {
  static var previews: some View {
    SectionView(classInfo: starredClassPreview, section: sectionPreview)
  }
}
#endif
