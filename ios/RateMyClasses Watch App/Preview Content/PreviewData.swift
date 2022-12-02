//
//  PreviewData.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 12/1/22.
//

let watchAppContextDataPreview = """
{"hasSynced":true,"starred":[{"schoolCode":"UY","departmentCode":"CS","classNumber":"2124","name":"Object Oriented Programming","description":"This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1","starredDate":1669737647675},{"schoolCode":"GT","departmentCode":"ITPG","classNumber":"2734","name":"Live Web","description":"The World Wide Web has grown up to be a great platform for asynchronous communication such as email and message boards. More recently this has extended into media posting and sharing. With the rise of broadband, more powerful computers and the prevalence networked media devices, synchronous communications have become more viable. Streaming media, audio and video conference rooms and text based chat give us the ability to create content and services tailored to a live audience. During this course, we focus on the types of content and interaction that can be supported through these technologies as well as explore new concepts around participation with a live distributed audience. In this course, we look at new and existing platforms for live communication on the web. We leverage existing services and use Flash, PHP, AJAX and possibly Processing/Java to develop our own solutions. Experience with ActionScript/Flash, PHP/MySQL and HTML/ JavaScript are helpful but not required. ","starredDate":1669737647675},{"schoolCode":"UY","departmentCode":"DM","classNumber":"2133","name":"3D Modeling","description":"In this studio, students will learn to produce and render high-quality 3D models. Upon completion of this course, students will have a solid understanding of the fundamentals of modeling, texturing, animation and lighting using industry standard software. Students may create content for video games, web, film, or other interfaces.","starredDate":1669741205114}],"selectedSemester":{"semesterCode":"sp", "year": 2023},"isAuthenticated":true,"schoolNameRecord":{"UY":"Tandon School of Engineering","GT":"Tisch School of the Arts"},"departmentNameRecord":{"UY":{"DM":"Integrated Design and Media","CS":"Computer Science"},"GT":{"ITPG":"Interactive Telecommunications"}}}
""".data(using: .utf8)

let starredClassPreview = StarredClass(
  schoolCode: "UY",
  departmentCode: "CS",
  classNumber: "2124",
  name: "Object Oriented Programming",
  description: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
  starredDate: 0)

let sectionPreview = SectionInfo(
  code: "LEC-A",
  instructors: ["John Apple"],
  type: "Lecture",
  status: "Open",
  meetings: [
    SectionInfo.Meeting(beginDate: "2023-01-23T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
    SectionInfo.Meeting(beginDate: "2023-01-25T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
    SectionInfo.Meeting(beginDate: "2023-01-27T13:00:00Z", minutesDuration: 170, endDate: "2023-05-09T03:59:00Z")
  ],
  name: "Test Section",
  campus: "Tandon",
  minUnits: 4,
  maxUnits: 4,
  location: "370J 310",
  notes: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
  prerequisites: "This intermediate-level programming course teaches object-oriented programming in C++. Topics: Pointers, dynamic memory allocation and recursion. Classes and objects including constructors, destructors, methods (member functions) and data members. Access and the interface to relationships of classes including composition, association and inheritance. Polymorphism through function overloading operators. Inheritance and templates. Use of the standard template library containers and algorithms. | Prerequisite: CS-UY 1134 (C- or better); Corequisite: EX-UY 1",
  recitations: [
    SectionInfo(
      code: "LAB-A",
      instructors: ["John Apple"],
      type: "Lecture",
      status: "Open",
      meetings: [
        SectionInfo.Meeting(beginDate: "2023-01-23T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
        SectionInfo.Meeting(beginDate: "2023-01-25T14:30:00Z", minutesDuration: 80, endDate: "2023-05-09T03:59:00Z"),
        SectionInfo.Meeting(beginDate: "2023-01-27T13:00:00Z", minutesDuration: 170, endDate: "2023-05-09T03:59:00Z")
      ],
      name: "Object Oriented Programming",
      campus: "Tandon",
      minUnits: 4,
      maxUnits: 4,
      location: "370J 310",
      notes: "Some notes",
      prerequisites: "Some prerequisites",
      recitations: nil)
  ])
