//
//  ContextModel.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/28/22.
//

import WatchConnectivity
import SwiftUI

struct StarredClassInfo: Codable {
  let schoolCode: String
  let departmentCode: String
  let classNumber: String
  let name: String
  let description: String
  let starredDate: Double
}

struct ApplicationContext: Codable {
  let synced: Bool
  let starred: [String: StarredClassInfo]
  let selectedSemester: String
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
      let semesterCode: String
      let month = Calendar(identifier: .gregorian).component(.month, from: Date())
      let year = Calendar(identifier: .gregorian).component(.year, from: Date())
      
      if (month <= 1) {
        semesterCode = "ja"
      } else if (month <= 5) {
        semesterCode = "sp"
      } else if (month <= 8) {
        semesterCode = "su"
      } else {
        semesterCode = "fa"
      }
      
      context = ApplicationContext(synced: false, starred: [:], selectedSemester: "\(semesterCode)\(year)", isAuthenticated: false)
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
