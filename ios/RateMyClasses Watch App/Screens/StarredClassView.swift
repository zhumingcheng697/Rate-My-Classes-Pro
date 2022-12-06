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
  @EnvironmentObject var appDelegate: AppDelegate
  @State var isRatingLoaded = false
  @State var rating: Rating? = nil
  @State var isLoadingSchedule = true
  @State var schedules: [SectionInfo]? = nil
  @State var timer: Timer? = nil
  
  var schoolName: String? {
    return contextModel.context.schoolNameRecord[starredClass.schoolCode]
  }
  
  var departmentName: String? {
    return contextModel.context.departmentNameRecord[starredClass.schoolCode]?[starredClass.departmentCode]
  }
  
  func fetchRating() {
    Task {
      rating = await Realm.getRating(classInfo: starredClass)
      isRatingLoaded = true
    }
  }
  
  func fetchSections(selectedSemester: Semester? = nil) {
    isLoadingSchedule = true
    
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
      VStack(alignment: .leading, spacing: 3) {
        Text(starredClass.name)
          .font(.title3)
          .foregroundColor(.accentColor)
          .fontWeight(.semibold)
          .padding([.horizontal])
        
        if schoolName == nil && departmentName == nil {
          Text("\(starredClass.departmentCode)-\(starredClass.schoolCode)")
            .font(.headline.leading(.tight))
            .padding([.horizontal])
        } else {
          VStack(alignment: .leading) {
            Text(schoolName ?? starredClass.schoolCode)
              .font(.headline.leading(.tight))
              .padding([.horizontal])
            
            Text(departmentName ?? starredClass.departmentCode)
              .font(.subheadline.leading(.tight))
              .padding([.horizontal])
          }
        }
        
        RatingDashboard(isRatingLoaded: $isRatingLoaded, rating: $rating)
          .padding(.horizontal)
          .padding(.top, 7)
          .padding(.bottom, 12)
        
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
        
        if starredClass.description.count != 0 {
          ReadMoreView(title: "Description", text: starredClass.description)
            .padding(.top, 2)
        }
      }
    }
    .onAppear {
      if !isRatingLoaded {
        fetchRating()
      }
      if schedules == nil {
        fetchSections()
      }
      appDelegate.updateUserActivity(title: "View \(starredClass.fullClassCode)", urlPath: "/starred/\(starredClass.schoolCode)/\(starredClass.departmentCode)/\(starredClass.classNumber)")
    }
    .onReceive(ContextModel.semesterPublisher) {
      fetchSections(selectedSemester: $0)
    }
    .navigationTitle(Text(starredClass.fullClassCode))
    .navigationBarTitleDisplayMode(.inline)
  }
}

#if DEBUG
struct StarredClassView_Previews: PreviewProvider {
  static var previews: some View {
    StarredClassView(starredClass: starredClassPreview)
      .environmentObject(ContextModel())
      .environmentObject(AppDelegate())
  }
}
#endif
