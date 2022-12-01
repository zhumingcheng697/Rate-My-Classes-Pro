//
//  StarredClassView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/29/22.
//

import SwiftUI

struct StarredClassView: View {
  let starredClass: StarredClass
  @EnvironmentObject var contextModel: ContextModel
  @State var isLoadingSchedule = true
  @State var schedules: [SectionInfo]? = nil
  @State var timer: Timer? = nil
  
  func fetchSections(selectedSemester: Semester? = nil) {
    if let timer = timer {
      timer.invalidate()
    }
    
    timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: false) { _ in
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
          ScheduleView(classInfo: starredClass, sections: $schedules, isLoading: $isLoadingSchedule)
        }) {
          if isLoadingSchedule {
            ProgressView()
          } else {
            Text(schedules == nil
                 ? "Unable to Load \(currentSemesterName) Schedule"
                 : schedules?.count == 0
                 ? "Not Offered in \(currentSemesterName)"
                 : "View \(currentSemesterName) Schedule")
          }
        }
        .disabled((!isLoadingSchedule && schedules != nil && schedules?.count != 0) ? false : true)
        .padding(.vertical)
        
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
    StarredClassView(starredClass: starredClassPreview)
    .environmentObject(ContextModel())
  }
}
