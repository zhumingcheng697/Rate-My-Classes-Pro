//
//  RNUserActivity.mm
//  RateMyClassesPro
//
//  Created by McCoy Zhu on 11/22/22.
//

#import "RNUserActivity.h"

@implementation RNUserActivity

RCT_EXPORT_MODULE(RNUserActivity);

NSMutableArray<NSUserActivity*> *validActivitityArray = nil;

NSMutableArray<NSUserActivity*> *temporaryActivityArray = nil;

+ (NSMutableArray<NSUserActivity*> *)validActivities
{
  if (validActivitityArray == nil) validActivitityArray = [NSMutableArray array];
  return validActivitityArray;
}

+ (NSMutableArray<NSUserActivity*> *)temporaryActivities
{
  if (temporaryActivityArray == nil) temporaryActivityArray = [NSMutableArray array];
  return temporaryActivityArray;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

+ (NSUserActivity*)lastValidUserActivity {
  NSMutableArray<NSUserActivity*>* userActivities = [self validActivities];
  
  if (!userActivities) return nil;
  
  if ([userActivities count] == 0) return nil;
  
  return [userActivities objectAtIndex:[userActivities count] - 1];
}

+ (void)invalidateAllUserActivities:(NSMutableArray<NSUserActivity*>*)userActivities {
  NSMutableArray<NSUserActivity*> *invalidatedActivities = [NSMutableArray array];
  
  for (NSUserActivity* activity in userActivities) {
    [activity invalidate];
    [invalidatedActivities addObject:activity];
  }
  
  [userActivities removeObjectsInArray:invalidatedActivities];
}

RCT_EXPORT_METHOD(becomeCurrent:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [RNUserActivity invalidateAllUserActivities:[RNUserActivity temporaryActivities]];
  
  if (!options) return reject(@"EMPTY_OPTIONS", @"Options cannot be empty", nil);
  
  NSString* activityType = options[@"activityType"];
  
  if (!activityType || ![activityType isKindOfClass:[NSString class]]) {
    return reject(@"BAD_ACTIVITY_TYPE", @"Activity type must be set to a string", nil);
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      UIResponder* delegate = (UIResponder*)[UIApplication sharedApplication].delegate;
      
      NSUserActivity* userActivity = [[NSUserActivity alloc] initWithActivityType:activityType];
      
      NSString* title = options[@"title"];
      if (title && [title isKindOfClass:[NSString class]]) userActivity.title = title;
      
      NSString* webpageURL = options[@"webpageURL"];
      if (webpageURL && [webpageURL isKindOfClass:[NSString class]]) userActivity.webpageURL = [NSURL URLWithString:webpageURL];
      
      NSNumber* eligibleForSearch = options[@"eligibleForSearch"];
      if (eligibleForSearch && [eligibleForSearch isKindOfClass:[NSNumber class]]) {
        userActivity.eligibleForSearch = [eligibleForSearch boolValue];
      }
      
      NSNumber* eligibleForHandoff = options[@"eligibleForHandoff"];
      if (eligibleForHandoff && [eligibleForHandoff isKindOfClass:[NSNumber class]]) {
        userActivity.eligibleForHandoff = [eligibleForHandoff boolValue];
      }
      
      if (@available(iOS 12.0, *)) {
        NSNumber* eligibleForPrediction = options[@"eligibleForPrediction"];
        if (eligibleForPrediction && [eligibleForPrediction isKindOfClass:[NSNumber class]]) {
          userActivity.eligibleForPrediction = [eligibleForPrediction boolValue];
        }
      }
      
      NSNumber* eligibleForPublicIndexing = options[@"eligibleForPublicIndexing"];
      if (eligibleForPublicIndexing && [eligibleForPublicIndexing isKindOfClass:[NSNumber class]]) {
        userActivity.eligibleForPublicIndexing = [eligibleForPublicIndexing boolValue];
      }
      
      NSDictionary* userInfo = options[@"userInfo"];
      if (userInfo && [userInfo isKindOfClass:[NSDictionary class]]) {
        userActivity.userInfo = userInfo;
      }
      
      delegate.userActivity = userActivity;
      [userActivity becomeCurrent];
      resolve(nil);
      
      NSNumber* isTemporary = options[@"isTemporary"];
      if (isTemporary && [isTemporary isKindOfClass:[NSNumber class]]) {
        if ([isTemporary boolValue]) {
          return [[RNUserActivity temporaryActivities] addObject:userActivity];
        }
      }
      
      [[RNUserActivity validActivities] addObject:userActivity];
    } @catch (NSError *err) {
      reject(@"ERROR", err.description, err);
    }
  });
}

RCT_EXPORT_METHOD(resignCurrent:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [RNUserActivity invalidateAllUserActivities:[RNUserActivity temporaryActivities]];
  
  NSUserActivity* activity = [RNUserActivity lastValidUserActivity];
  
  if (!activity) return reject(@"NO_ACTIVITY", @"There are no activities no inactivate", nil);
  
  [activity resignCurrent];
  resolve(nil);
}

RCT_EXPORT_METHOD(invalidateCurrent:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [RNUserActivity invalidateAllUserActivities:[RNUserActivity temporaryActivities]];
  
  NSUserActivity* activity = [RNUserActivity lastValidUserActivity];
  
  if (!activity) return reject(@"NO_ACTIVITY", @"There are no activities no invalidate", nil);
  
  [activity invalidate];
  resolve(nil);
}

RCT_EXPORT_METHOD(invalidateAll:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [RNUserActivity invalidateAllUserActivities:[RNUserActivity temporaryActivities]];
  [RNUserActivity invalidateAllUserActivities:[RNUserActivity validActivities]];
  resolve(nil);
}

@end
