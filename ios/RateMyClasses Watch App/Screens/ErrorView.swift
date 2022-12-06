//
//  ErrorView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import SwiftUI

struct ErrorView: View {
  let iconName: String
  let title: String
  let message: String
  
  var body: some View {
    VStack(spacing: 4) {
      Image(systemName: iconName)
        .foregroundColor(.red)
        .symbolVariant(.fill)
        .symbolVariant(.slash)
        .symbolRenderingMode(.hierarchical)
        .font(.title2)
      
      Text(title)
        .multilineTextAlignment(.center)
      
      Text(message)
        .font(.caption2)
        .multilineTextAlignment(.center)
        .foregroundColor(.secondary)
    }
  }
}

struct ErrorView_Previews: PreviewProvider {
  static var previews: some View {
    ErrorView(
      iconName: "person.crop.circle.badge.exclamationmark",
      title: "Not Signed In",
      message: "Please sign in on the Rate My Classes app on your iPhone to track your starred classes.")
  }
}
