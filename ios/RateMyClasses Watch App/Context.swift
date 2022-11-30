//
//  ContextModel.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/28/22.
//

import WatchConnectivity
import SwiftUI

struct StarredClass: Codable, Hashable, Identifiable {
  let schoolCode: String
  let departmentCode: String
  let classNumber: String
  let name: String
  let description: String
  let starredDate: Double

  var fullClassCode: String {
    return "\(departmentCode)-\(schoolCode) \(classNumber)"
  }
  
  var id: String {
    return fullClassCode
  }
}

enum SemesterCode: String, Codable {
  case ja, sp, su, fa
}

struct Semester: Codable {
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
}

struct ApplicationContext: Codable {
  let synced: Bool
  let starred: [StarredClass]
  let selectedSemester: Semester
  let isAuthenticated: Bool
}

class ContextModel: NSObject, WCSessionDelegate, ObservableObject {
  @Published var context: ApplicationContext
  
  private static let userDefaultsKey = "RATE_MY_CLASSES_PRO:APPLICATION_CONTEXT"
  
  init(session: WCSession = .default) {
    if let data = UserDefaults.standard.data(forKey: ContextModel.userDefaultsKey),
       let decodedContext = try? JSONDecoder().decode(ApplicationContext.self, from: data) {
      context = decodedContext
      super.init()
    } else {
      context = ApplicationContext(synced: false, starred: [], selectedSemester: Semester.predictCurrentSemester(), isAuthenticated: false)
      super.init()
      updateUserDefaults()
    }
    
    session.delegate = self
    session.activate()
  }
  
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if let error = error { print(error) }
  }
  
  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any] = [:]) {
    if let dataString = userInfo["context"] as? String,
       let data = dataString.data(using: .utf8),
       let decodedContext = try? JSONDecoder().decode(ApplicationContext.self, from: data) {
      context = decodedContext
      updateUserDefaults()
    }
  }
  
  private func updateUserDefaults() {
    if let data = try? JSONEncoder().encode(context) {
      UserDefaults.standard.setValue(data, forKey: ContextModel.userDefaultsKey)
    }
  }
}
