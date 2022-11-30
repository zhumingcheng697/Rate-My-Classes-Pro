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
      return ("person.2", "Not Signed In", "Please sign in on the Rate My Classes app on your iPhone to track your starred classes.")
    } else if contextModel.context.starred.count == 0 {
      return ("star", "No Starred Classes", "Please star some classes on the Rate My Classes app on your iPhone to track them here.")
    } else {
      return nil
    }
  }
  
  var body: some View {
    if let error = error {
      VStack(spacing: 4) {
        Image(systemName: error.iconName)
          .foregroundColor(.red)
          .symbolVariant(.fill)
          .symbolVariant(.slash)
          .symbolRenderingMode(.hierarchical)
          .font(.title2)
        
        Text(error.title)
          .multilineTextAlignment(.center)
        
        Text(error.message)
          .font(.caption2)
          .multilineTextAlignment(.center)
          .foregroundColor(.secondary)
      }.padding(.horizontal)
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
