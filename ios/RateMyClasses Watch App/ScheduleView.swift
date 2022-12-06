//
//  ScheduleView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct ScheduleView: View {
  let classInfo: ClassInfo
  @EnvironmentObject var contextModel: ContextModel
  @EnvironmentObject var appDelegate: AppDelegate
  @Binding var sections: [SectionInfo]?
  @Binding var isLoading: Bool
  
  var diff: Int {
    return contextModel.context.selectedSemester - Semester.predictCurrentSemester()
  }
  
  func recitationsFor(_ section: SectionInfo) -> [SectionInfo] {
    if let recitations = section.recitations {
      var recitationCodes = Set<String>()
      var recitationsToKeep = [SectionInfo]()
      for recitation in recitations {
        if !recitationCodes.contains(recitation.code) {
          recitationCodes.insert(recitation.code)
          recitationsToKeep.append(recitation)
        }
      }
      recitationsToKeep.sort { $0.code < $1.code }
      return recitationsToKeep
    }
    return []
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
                  SectionView(classInfo: classInfo, section: section)
                }.buttonBorderShape(.roundedRectangle)
                ForEach(recitationsFor(section), id: \.code) { recitation in
                  NavigationLink("\(classInfo.fullClassCode) \(recitation.code)") {
                    SectionView(classInfo: classInfo, section: recitation)
                  }.buttonBorderShape(.roundedRectangle)
                }
              }
            }
          }
          .onAppear {
            appDelegate.updateUserActivity(title: "View \(classInfo.fullClassCode) Schedule", urlPath: "/starred/\(classInfo.schoolCode)/\(classInfo.departmentCode)/\(classInfo.classNumber)/schedule")
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

#if DEBUG
struct ScheduleView_Previews: PreviewProvider {
  static var previews: some View {
    ScheduleView(classInfo: starredClassPreview, sections: .constant(Array(repeating: sectionPreview, count: 4)), isLoading: .constant(false))
      .environmentObject(ContextModel())
      .environmentObject(AppDelegate())
  }
}
#endif
