//
//  RateMyClassesApp.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

@main
struct RateMyClassesWatchApp: App {
  @WKApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
  @StateObject var contextModel = ContextModel()

  var body: some Scene {
    WindowGroup {
      ContentView()
        .environmentObject(contextModel)
    }
  }
}
