//
//  IconPair.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct IconPair<Content: View>: View {
  let iconName: String
  let content: () -> Content
  let symbolRenderingMode: SymbolRenderingMode = .hierarchical
  
  var body: some View {
    Group {
      Image(systemName: iconName)
        .foregroundColor(.accentColor)
        .symbolRenderingMode(symbolRenderingMode)
      
      content()
    }
  }
}

struct IconPair_Previews: PreviewProvider {
  static var previews: some View {
    IconPair(iconName: "graduationcap.fill") {
      Text("Apple, John")
    }
  }
}
