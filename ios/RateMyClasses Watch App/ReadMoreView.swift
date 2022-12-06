//
//  ReadMoreView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 12/1/22.
//

import SwiftUI

struct ReadMoreView: View {
  let title: any StringProtocol
  let text: any StringProtocol
  
  var body: some View {
    NavigationLink(title) {
      ScrollView {
        HStack {
          Text(text)
            .font(.caption)
            .padding(.horizontal)
          
          Spacer(minLength: 0)
        }
      }.navigationTitle(Text(title))
    }.buttonBorderShape(.roundedRectangle)
  }
}

struct ReadMoreView_Previews: PreviewProvider {
  static var previews: some View {
    ReadMoreView(title: "Title", text: "Hi")
  }
}
