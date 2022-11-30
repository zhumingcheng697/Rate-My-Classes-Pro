//
//  IconTextPair.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct IconTextPair: View {
  let iconName: String
  let text: any StringProtocol
  let symbolRenderingMode: SymbolRenderingMode = .hierarchical
  
  var body: some View {
    Image(systemName: iconName)
      .foregroundColor(.accentColor)
      .symbolRenderingMode(symbolRenderingMode)
    
    Text(text)
  }
}

struct IconTextPair_Previews: PreviewProvider {
  static var previews: some View {
    IconTextPair(iconName: "graduationcap.fill", text: "Apple, John")
  }
}
