//
//  ContentView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

struct ContentView: View {
  @EnvironmentObject var contextModel: ContextModel
  
  func starredClassToString(_ starredClassInfo: StarredClass) -> String {
    if let data = try? JSONEncoder().encode(starredClassInfo) {
      if let str = String(data: data, encoding: .utf8) {
        return str
      }
    }
    return starredClassInfo.fullClassCode
  }
  
  var body: some View {
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

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
      .environmentObject(ContextModel())
  }
}
