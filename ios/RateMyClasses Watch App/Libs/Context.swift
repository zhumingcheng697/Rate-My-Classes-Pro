//
//  Context.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/28/22.
//

import WatchConnectivity
import Combine

struct WatchAppContext: Codable {
  let hasSynced: Bool
  let starred: [StarredClass]
  let selectedSemester: Semester
  let isAuthenticated: Bool
  let schoolNameRecord: [String: String]
  let departmentNameRecord: [String: [String: String]]
}

class ContextModel: NSObject, WCSessionDelegate, ObservableObject {
  @Published var context: WatchAppContext
  
  static let semesterPublisher = PassthroughSubject<Semester, Never>()
  
  private static let userDefaultsKey = "RATE_MY_CLASSES_PRO:WATCH_APP_CONTEXT"
  
  init(session: WCSession = .default) {
    if let data = UserDefaults.standard.data(forKey: ContextModel.userDefaultsKey),
       let decodedContext = try? JSONDecoder().decode(WatchAppContext.self, from: data) {
      context = decodedContext
      super.init()
    } else {
      context = WatchAppContext(hasSynced: false, starred: [], selectedSemester: Semester.predictCurrentSemester(), isAuthenticated: false, schoolNameRecord: [:], departmentNameRecord: [:])
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
    decodeContext(userInfo)
  }
  
  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
    decodeContext(applicationContext)
  }
  
  private func decodeContext(_ payload: [String: Any]) {
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let decodedContext = try? JSONDecoder().decode(WatchAppContext.self, from: data) {
      let semester = context.selectedSemester
      context = decodedContext
      
      if context.selectedSemester != semester {
        ContextModel.semesterPublisher.send(context.selectedSemester)
      }
      
      updateUserDefaults()
    }
  }
  
  private func updateUserDefaults() {
    if let data = try? JSONEncoder().encode(context) {
      UserDefaults.standard.setValue(data, forKey: ContextModel.userDefaultsKey)
    }
  }
}
