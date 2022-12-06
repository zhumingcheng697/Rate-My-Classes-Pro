//
//  Realm.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 12/1/22.
//

import Foundation

struct Realm {
  private static let baseURL = Bundle.main.object(forInfoDictionaryKey: "REALM_RATING_ENDPOINT")
  
  static func getRating(classInfo: ClassInfo) async -> Rating? {
    if let baseURL = baseURL,
       let classCode = classInfo.fullClassCode.uppercased().addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
       let url = URL(string: "\(baseURL)?class=\(classCode)" ),
       let (data, _) = try? await URLSession.shared.data(from: url) {
     return try? JSONDecoder().decode(Rating.self, from: data)
    }
    return nil
  }
}
