//
//  ContentView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/24/22.
//

import SwiftUI

struct ContentView: View {
  @State var semesters: Array<String> = [];
  
  var body: some View {
    VStack {
      Image(systemName: "graduationcap.fill")
        .imageScale(.large)
        .foregroundColor(.accentColor)
      
      Text("Rate My Classes")
      
      if self.semesters.count == 0 {
        Button("Load Data") {
          guard let url = URL(string: "https://nyu.a1liu.com/api/terms") else { return }
          URLSession.shared.dataTask(with: URLRequest(url: url)) { data, res, err in
            guard let data = data else { return }
            if let list = try? JSONDecoder().decode(Array<String>.self, from: data) {
              self.semesters = list;
            }
          }.resume()
        }.buttonStyle(.bordered)
      } else {
        ScrollView {
          ForEach(self.semesters, id: \.self) { semester in
            Text(semester) 
          }
          
          Button("Clear") {
            self.semesters = [];
          }.buttonBorderShape(.capsule).padding(.vertical)
        }
      }
    }
    .padding()
    .ignoresSafeArea(.container, edges: self.semesters.count == 0 ? [] : [.bottom])
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
