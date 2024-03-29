//
//  StarredClassViewNavLink.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/29/22.
//

import SwiftUI

struct StarredClassViewNavLink: View {
  let starredClass: StarredClass
  
  var body: some View {
    NavigationLink(destination: StarredClassView(starredClass: starredClass)) {
      VStack {
        Text(starredClass.name)
          .foregroundColor(.accentColor)
          .fontWeight(.medium)
          .lineLimit(3)
        
        Text(starredClass.fullClassCode)
          .font(.caption)
      }
    }.buttonBorderShape(.roundedRectangle)
  }
}

#if DEBUG
struct StarredClassViewNavLink_Previews: PreviewProvider {
  static var previews: some View {
    StarredClassViewNavLink(starredClass: starredClassPreview)
      .environmentObject(ContextModel())
  }
}
#endif
