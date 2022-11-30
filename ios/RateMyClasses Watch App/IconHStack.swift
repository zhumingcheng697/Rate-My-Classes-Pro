//
//  IconHStack.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct IconHStack: View {
  let iconName: String
  let text: any StringProtocol
    var body: some View {
      HStack {
        Image(systemName: iconName)
          .foregroundColor(.accentColor)
        
        Text(text)
      }
    }
}

struct IconHStack_Previews: PreviewProvider {
    static var previews: some View {
        IconHStack(iconName: "graduationcap.fill", text: "Apple, John")
    }
}
