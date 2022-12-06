//
//  ContentView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

struct ContentView: View {
  @EnvironmentObject var contextModel: ContextModel
  @EnvironmentObject var appDelegate: AppDelegate
  
  var error: (iconName: String, title: String, message: String, userActivityTitle: String?, urlPath: String)? {
    if !contextModel.context.hasSynced {
      return ("exclamationmark.arrow.triangle.2.circlepath", "No Data Available", "Please open or restart the Rate My Classes app on your iPhone to start syncing.", nil, "")
    } else if !contextModel.context.isAuthenticated {
      return ("person.crop.circle.badge.exclamationmark", "Not Signed In", "Please sign in on the Rate My Classes app on your iPhone to track your starred classes.", "Sign In", "/sign-in")
    } else if contextModel.context.starred.count == 0 {
      return ("star", "No Starred Classes", "Please star some classes on the Rate My Classes app on your iPhone to track them here.", nil, "")
    } else {
      return nil
    }
  }
  
  var body: some View {
    Section {
      if let error = error {
        ErrorView(iconName: error.iconName, title: error.title, message: error.message)
          .padding(.horizontal)
          .onAppear {
            appDelegate.updateUserActivity(title: error.title, urlPath: error.urlPath)
          }
      } else {
        NavigationView {
          ScrollView {
            ForEach(contextModel.context.starred) { starredClass in
              StarredClassViewNavLink(starredClass: starredClass)
            }
          }
          .onAppear {
            appDelegate.updateUserActivity(title: "View Starred Classes", urlPath: "/starred")
          }
          .navigationTitle(Text("Starred"))
          .navigationBarTitleDisplayMode(.large)
        }
      }
    }
  }
}

#if DEBUG
struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
      .environmentObject(ContextModel())
      .environmentObject(AppDelegate())
  }
}
#endif
