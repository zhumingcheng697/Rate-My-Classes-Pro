//
//  RatingDashboard.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 12/1/22.
//

import SwiftUI

fileprivate struct RatingBlock: View {
  @Binding var isRatingLoaded: Bool
  @Binding var rating: Rating?
  let value: KeyPath<Rating, Double>
  
  var ratingType: String {
    if value == \.enjoyment {
      return "Enjoyment"
    } else if value == \.difficulty {
      return "Difficulty"
    } else if value == \.workload {
      return "Workload"
    } else {
      return "Value"
    }
  }
  
  var body: some View {
    VStack {
      Text(ratingType)
        .foregroundColor(.accentColor)
        .font(.footnote)
        .fontWeight(.semibold)
      
      Group {
        if !isRatingLoaded {
          ProgressView()
        } else if let rating = rating {
          Text("\(String(format:"%.1f", rating[keyPath: value])) / 5.0")
            .font(.callout)
            .fontWeight(.medium)
        } else {
          Text("N/A")
            .font(.callout)
            .fontWeight(.medium)
        }
      }.frame(height: 17, alignment: .bottom)
    }
  }
}

struct RatingDashboard: View {
  @Binding var isRatingLoaded: Bool
  @Binding var rating: Rating?
  
  var body: some View {
    LazyVGrid(columns: [GridItem(.adaptive(minimum: 75))], spacing: 6) {
      RatingBlock(isRatingLoaded: $isRatingLoaded, rating: $rating, value: \.enjoyment)
      
      RatingBlock(isRatingLoaded: $isRatingLoaded, rating: $rating, value: \.difficulty)
      
      RatingBlock(isRatingLoaded: $isRatingLoaded,rating: $rating, value: \.workload)
      
      RatingBlock(isRatingLoaded: $isRatingLoaded,rating: $rating, value: \.value)
    }
  }
}

struct RatingDashboard_Previews: PreviewProvider {
  static var previews: some View {
    RatingDashboard(isRatingLoaded: .constant(true), rating: .constant(Rating(enjoyment: 5, difficulty: 2, workload: 3, value: 5)))
  }
}
