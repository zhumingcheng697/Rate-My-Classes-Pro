//
//  Semester.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import Foundation

struct Semester: Codable, Equatable, Comparable {
  enum SemesterCode: String, Codable, CaseIterable {
    case ja, sp, su, fa
  }
  
  let semesterCode: SemesterCode
  let year: Int
  
  var code: String {
    return "\(semesterCode.rawValue)\(year)"
  }
  
  var name: String {
    let semesterName: String
    switch semesterCode {
      case .ja:
        semesterName = "J-Term"
      case .sp:
        semesterName = "Spring"
      case .su:
        semesterName = "Summer"
      case .fa:
        semesterName = "Fall"
    }
    return "\(semesterName) \(year)"
  }
  
  static func predictCurrentSemester() -> Semester {
    let semesterCode: SemesterCode
    let month = Calendar(identifier: .gregorian).component(.month, from: Date())
    let year = Calendar(identifier: .gregorian).component(.year, from: Date())
    
    if (month <= 1) {
      semesterCode = .ja
    } else if (month <= 5) {
      semesterCode = .sp
    } else if (month <= 8) {
      semesterCode = .su
    } else {
      semesterCode = .fa
    }
    
    return Semester(semesterCode: semesterCode, year: year)
  }
  
  static func -(lhs: Semester, rhs: Semester) -> Int {
    return (lhs.year - rhs.year) * 4 + (SemesterCode.allCases.firstIndex(of: lhs.semesterCode) ?? 0) - (SemesterCode.allCases.firstIndex(of: rhs.semesterCode) ?? 0)
  }
  
  static func <(lhs: Semester, rhs: Semester) -> Bool {
    return lhs - rhs < 0
  }
  
  static func >(lhs: Semester, rhs: Semester) -> Bool {
    return lhs - rhs > 0
  }
}
