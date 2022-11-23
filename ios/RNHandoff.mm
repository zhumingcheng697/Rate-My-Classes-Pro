//
//  RNHandoff.mm
//  RateMyClassesPro
//
//  Created by McCoy Zhu on 11/22/22.
//

#import "RNHandoff.h"

@implementation RNHandoffModule

RCT_EXPORT_MODULE(RNHandoffModule);

NSMutableArray<NSUserActivity*> *validActivities = nil;

NSMutableArray<NSUserActivity*> *temporaryActivities = nil;

- (NSMutableArray<NSUserActivity*> *)validActivities
{
    if (validActivities == nil) validActivities = [NSMutableArray array];
    return validActivities;
}

- (NSMutableArray<NSUserActivity*> *)temporaryActivities
{
    if (temporaryActivities == nil) temporaryActivities = [NSMutableArray array];
    return temporaryActivities;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_REMAP_METHOD(addUserActivity, options:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSMutableArray<NSUserActivity*> *invalidatedActivities = [NSMutableArray array];
  
  for (NSUserActivity* activity in [self temporaryActivities]) {
    [activity invalidate];
    [invalidatedActivities addObject:activity];
  }
  
  [[self temporaryActivities] removeObjectsInArray:invalidatedActivities];
  
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
          return [[self temporaryActivities] addObject:userActivity];
        }
      }
      
      [[self validActivities] addObject:userActivity];
    } @catch (NSError *err) {
      reject(@"ERROR", err.description, err);
    }
  });
}


RCT_REMAP_METHOD(invalidateUserActivities, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSMutableArray<NSUserActivity*> *invalidatedActivities = [NSMutableArray array];
  
  for (NSUserActivity* activity in [self validActivities]) {
    [activity invalidate];
    [invalidatedActivities addObject:activity];
  }
  
  [[self validActivities] removeObjectsInArray:invalidatedActivities];
  
  resolve(nil);
}

@end
