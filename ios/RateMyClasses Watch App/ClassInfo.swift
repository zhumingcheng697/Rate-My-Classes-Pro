//
//  ClassInfo.swift
//  RateMyClasses Watch App
//
//  Created by McCoy Zhu on 11/30/22.
//

import Foundation

protocol ClassInfo {
  var schoolCode: String { get }
  var departmentCode: String { get }
  var classNumber: String { get }
  var name: String { get }
  var fullDepartmentCode: String { get }
  var fullClassCode: String { get }
}

extension ClassInfo {
  var fullDepartmentCode: String {
    return "\(departmentCode)-\(schoolCode)"
  }
  
  var fullClassCode: String {
    return "\(fullDepartmentCode) \(classNumber)"
  }
}

struct StarredClass: ClassInfo, Codable, Hashable, Identifiable {
  let schoolCode: String
  let departmentCode: String
  let classNumber: String
  let name: String
  let description: String
  let starredDate: Double
  
  var id: String {
    return fullClassCode
  }
}

struct SectionInfo: Codable, Hashable {
  struct Meeting: Codable, Hashable {
    let beginDate: String
    let minutesDuration: Int
    let endDate: String
  }
  
  let code: String
  let instructors: [String]?
  let type: String?
  let status: String?
  let meetings: [Meeting]?
  let name: String?
  let campus: String?
  let minUnits: Int?
  let maxUnits: Int?
  let location: String?
  let notes: String?
  let prerequisites: String?
  let recitations: [SectionInfo]?
  
  var schedule: [(day: String, time: String)]? {
    func getTimeIntervalString(from: Date, to: Date) -> String {
      let dateIntervalFormatter = DateIntervalFormatter()
      dateIntervalFormatter.calendar = Calendar(identifier: .gregorian)
      dateIntervalFormatter.dateTemplate = "h:mm"
      return dateIntervalFormatter.string(from: from, to: to)
    }
    
    func getWeekDayString(date: Date) -> String {
      let dateFormatter = DateFormatter()
      dateFormatter.calendar = Calendar(identifier: .gregorian)
      dateFormatter.dateFormat = "E"
      return dateFormatter.string(from: date)
    }
    
    if let meetings = meetings {
      var weeklySchedule = [Int: [(from: Date, to: Date)]]()
      
      for meeting in meetings {
        if let begin = try? Date(meeting.beginDate, strategy: .iso8601) {
          let end = begin + TimeInterval(meeting.minutesDuration * 60)
          let dayOfWeek = Calendar(identifier: .gregorian).component(.weekday, from: begin) - 1
          weeklySchedule[dayOfWeek, default: []].append((begin, end))
        }
      }
      
      var stringifiedSchedule = [Int: String]()
      
      for (day, dailySchedule) in weeklySchedule {
        var stringifiedDailySchedule = [String]()
        
        dailySchedule.sorted { $0.from < $1.from }.forEach { meeting in
          let meetingStr = getTimeIntervalString(from: meeting.0, to: meeting.1)
          if !stringifiedDailySchedule.contains(meetingStr) {
            stringifiedDailySchedule.append(meetingStr)
          }
        }
        
        stringifiedSchedule[day] = stringifiedDailySchedule.joined(separator: ", ")
      }
      
      var finalSchedule = [(day: String, time: String)]()
      
      for i in 1...7 {
        let day = i % 7
        if let currDaySchedule = weeklySchedule[day], currDaySchedule.count > 0,
           let currMeeting = stringifiedSchedule[day] {
          var currDay = [getWeekDayString(date: currDaySchedule[0].from)]
          weeklySchedule.removeValue(forKey: day)
          
          for j in i + 1...7 {
            let otherDay = j % 7
            if let otherDaySchedule = weeklySchedule[otherDay],
               otherDaySchedule.count > 0 && stringifiedSchedule[otherDay] == currMeeting {
              currDay.append(getWeekDayString(date: otherDaySchedule[0].0))
              weeklySchedule.removeValue(forKey: otherDay)
            }
          }
          
          finalSchedule.append((currDay.joined(separator: ", "), currMeeting))
        }
      }
      
      return finalSchedule
    }
    
    return nil
  }
}
