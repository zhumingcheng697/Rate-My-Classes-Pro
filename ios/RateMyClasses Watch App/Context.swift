//
//  Context.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/28/22.
//

import WatchConnectivity

struct WatchAppContext: Codable {
  let hasSynced: Bool
  let starred: [StarredClass]
  let selectedSemester: Semester
  let isAuthenticated: Bool
}

class ContextModel: NSObject, WCSessionDelegate, ObservableObject {
  @Published var context: WatchAppContext
  
  private static let userDefaultsKey = "RATE_MY_CLASSES_PRO:APPLICATION_CONTEXT"
  
  init(session: WCSession = .default) {
    if let data = UserDefaults.standard.data(forKey: ContextModel.userDefaultsKey),
       let decodedContext = try? JSONDecoder().decode(WatchAppContext.self, from: data) {
      context = decodedContext
      super.init()
    } else {
      context = WatchAppContext(hasSynced: false, starred: [], selectedSemester: Semester.predictCurrentSemester(), isAuthenticated: false)
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
    if let data = try? JSONSerialization.data(withJSONObject: userInfo),
       let decodedContext = try? JSONDecoder().decode(WatchAppContext.self, from: data) {
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
