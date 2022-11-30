//
//  ContentView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

struct ContentView: View {
  @EnvironmentObject var contextModel: ContextModel
  
  func starredClassInfoToString(_ starredClassCode: String) -> String {
    if let data = try? JSONEncoder().encode(contextModel.context.starred[starredClassCode]) {
      if let str = String(data: data, encoding: .utf8) {
        return str
      }
    }
    return starredClassCode
  }
  
  var body: some View {
    VStack {
      HStack {
        Spacer()
        
        Image(systemName: "graduationcap.fill")
          .imageScale(.large)
          .foregroundColor(.accentColor)
        
        Spacer()
        
        VStack {
          Text(contextModel.context.selectedSemester)
            .font(.headline)
            .foregroundColor(.accentColor)
          
          Text(contextModel.context.isAuthenticated ? "Signed In" : "Not Signed In")
        }
        
        Spacer()
      }
      
      ScrollView {
        ForEach(Array(contextModel.context.starred.keys), id: \.self) { starredClassCode in
          Text(starredClassInfoToString(starredClassCode))
            .foregroundColor(.secondary)
        }
      }
    }
    .padding()
    .ignoresSafeArea(.all, edges: [.bottom])
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
      .environmentObject(ContextModel())
  }
}
