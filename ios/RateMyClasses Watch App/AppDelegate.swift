//
//  AppDelegate.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 12/2/22.
//

import Foundation
import SwiftUI

class AppDelegate: NSObject, WKApplicationDelegate, ObservableObject, NSUserActivityDelegate {
  private var userActivity: NSUserActivity? = nil
  
  func applicationWillEnterForeground() {
    if let userActivity = userActivity {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        userActivity.becomeCurrent()
      }
    }
  }

  func applicationDidBecomeActive() {
    if let userActivity = userActivity {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        userActivity.becomeCurrent()
      }
    }
  }
  
  func updateUserActivity(title: String?, urlPath: String) {
    if let webDeploymentURL = Bundle.main.object(forInfoDictionaryKey: "WEB_DEPLOYMENT_URL") as? String,
       let url = URL(string: webDeploymentURL + urlPath),
       let activityTypes = (Bundle.main.object(forInfoDictionaryKey: "NSUserActivityTypes") as? [String]),
       activityTypes.count != 0 {
      let userActivity = NSUserActivity(activityType: activityTypes[0])
      userActivity.title = title
      userActivity.isEligibleForHandoff = true
      userActivity.isEligibleForSearch = true
      userActivity.isEligibleForPrediction = true
      userActivity.webpageURL = url
      userActivity.delegate = self
      userActivity.becomeCurrent()
      self.userActivity = userActivity
    }
  }
}
