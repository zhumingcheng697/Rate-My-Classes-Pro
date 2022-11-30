//
//  StarredClassView.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/29/22.
//

import SwiftUI

struct StarredClassView: View {
  @EnvironmentObject var contextModel: ContextModel
  let starredClass: StarredClass
  
  var body: some View {
    ScrollView {
      VStack(alignment: .leading) {
        Text(starredClass.name)
          .font(.title3)
          .foregroundColor(.accentColor)
          .padding([.horizontal])
        
        Text(starredClass.fullClassCode)
          .font(.callout)
          .fontWeight(.medium)
          .padding([.horizontal])
        
        Button("\(contextModel.context.selectedSemester.name) Schedule") {
          
        }
        .padding(.vertical)
        
        Text(starredClass.description)
          .font(.caption)
          .padding([.horizontal])
      }
    }
    .navigationTitle(Text(starredClass.fullClassCode))
    .navigationBarTitleDisplayMode(.inline)
  }
}

struct StarredClassView_Previews: PreviewProvider {
  static var previews: some View {
    StarredClassView(starredClass: StarredClass(
      schoolCode: "UY",
      departmentCode: "CS",
      classNumber: "2124",
      name: "Object Oriented Programming",
      description: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
      starredDate: 0))
    .environmentObject(ContextModel())
  }
}