//
//  ClassInfo.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

protocol ClassInfo {
  var schoolCode: String { get }
  var departmentCode: String { get }
  var classNumber: String { get }
  var name: String { get }
  var fullDepartmentCode: String { get }
  var fullClassCode: String { get }
}

extension ClassInfo {
  var fullDepartmentCode: String {
    return "\(departmentCode)-\(schoolCode)"
  }
  
  var fullClassCode: String {
    return "\(fullDepartmentCode) \(classNumber)"
  }
}

struct StarredClass: ClassInfo, Codable, Hashable, Identifiable {
  let schoolCode: String
  let departmentCode: String
  let classNumber: String
  let name: String
  let description: String
  let starredDate: Double
  
  var id: String {
    return fullClassCode
  }
}

struct SectionInfo: Codable, Hashable {
  struct Meeting: Codable, Hashable {
    let beginDate: String
    let minutesDuration: Int
    let endDate: String
  }
  
  let code: String
  let instructors: [String]?
  let type: String?
  let stauts: String?
  let meetings: [Meeting]?
  let name: String?
  let campus: String?
  let minUnits: Int?
  let maxUnits: Int?
  let location: String?
  let notes: String?
  let prerequisites: String?
  let recitations: [SectionInfo]?
}
