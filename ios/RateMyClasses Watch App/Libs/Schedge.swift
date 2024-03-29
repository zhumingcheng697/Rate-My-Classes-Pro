//
//  Schedge.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import Foundation

struct Schedge {
  private struct ClassRecord: Codable, Hashable, Equatable {
    let name: String?
    let deptCourseId: String?
    let subjectCode: String?
    let sections: [SectionInfo]?
  }
  
  private static let baseURL = "https://nyu.a1liu.com/api"
  
  static func getSchedule(classInfo: ClassInfo, selectedSemester: Semester) async -> [SectionInfo]? {
    if let url = URL(string: "\(baseURL)/courses/\(selectedSemester.code)/\(classInfo.fullDepartmentCode)"),
       let (data, _) = try? await URLSession.shared.data(from: url),
       let classRecords = try? JSONDecoder().decode([ClassRecord].self, from: data) {
      let sections = classRecords.first {
        $0.name?.uppercased() == classInfo.name.uppercased() &&
        $0.deptCourseId == classInfo.classNumber &&
        $0.subjectCode == classInfo.fullDepartmentCode
      }?.sections ?? []
      var sectionCodes = Set<String>()
      var sectionsToKeep = [SectionInfo]()
      for section in sections {
        if !sectionCodes.contains(section.code) {
          sectionCodes.insert(section.code)
          sectionsToKeep.append(section)
        }
      }
      sectionsToKeep.sort { $0.code < $1.code }
      return sectionsToKeep
    }
    return nil
  }
}
