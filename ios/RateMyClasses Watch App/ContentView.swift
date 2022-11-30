//
//  ContentView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

struct ContentView: View {
  @EnvironmentObject var contextModel: ContextModel
  
  var error: (iconName: String, title: String, message: String)? {
    if !contextModel.context.hasSynced {
      return ("exclamationmark.arrow.triangle.2.circlepath", "No Data Available", "Please open the Rate My Classes app on your iPhone to start syncing.")
    } else if !contextModel.context.isAuthenticated {
      return ("person.crop.circle.badge.exclamationmark", "Not Signed In", "Please sign in on the Rate My Classes app on your iPhone to track your starred classes.")
    } else if contextModel.context.starred.count == 0 {
      return ("star", "No Starred Classes", "Please star some classes on the Rate My Classes app on your iPhone to track them here.")
    } else {
      return nil
    }
  }
  
  var body: some View {
    if let error = error {
      ErrorView(iconName: error.iconName, title: error.title, message: error.message)
        .padding(.horizontal)
    } else {
      NavigationView {
        ScrollView {
          ForEach(contextModel.context.starred) { starredClass in
            StarredClassViewNavLink(starredClass: starredClass)
          }
        }
        .navigationTitle(Text("Starred"))
        .navigationBarTitleDisplayMode(.large)
      }
    }
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
      .environmentObject(ContextModel())
  }
}
