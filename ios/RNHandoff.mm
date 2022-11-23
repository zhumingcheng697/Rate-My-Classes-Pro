//
//  RNHandoff.mm
//  RateMyClassesPro
//
//  Created by McCoy Zhu on 11/22/22.
//

#import "RNHandoff.h"

@implementation RNHandoffModule

RCT_EXPORT_MODULE(RNHandoffModule);

NSMutableArray<NSUserActivity*> *activities = nil;

- (NSMutableArray<NSUserActivity*> *)activityList
{
    if (activities == nil) activities = [NSMutableArray array];
    return activities;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_REMAP_METHOD(addUserActivity, activityType:(NSString*)activityType title:(NSString*)title url:(NSString*)url isTemporary:(BOOL)isTemporary resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSMutableArray<NSUserActivity*> *invalidatedActivities = [NSMutableArray array];
  
  for (NSUserActivity* activity in [self activityList]) {
    [activity invalidate];
    [invalidatedActivities addObject:activity];
  }
  
  [[self activityList] removeObjectsInArray:invalidatedActivities];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIResponder* delegate = (UIResponder*)[UIApplication sharedApplication].delegate;
    
    if (!activityType) return reject(@"ERROR", @"Activity type cannot be empty", nil);
    
    NSUserActivity* userActivity = [[NSUserActivity alloc] initWithActivityType:activityType];
    
    if (title) userActivity.title = title;
    if (url) userActivity.webpageURL = [NSURL URLWithString:url];
    
    userActivity.eligibleForHandoff = YES;
    
    if (isTemporary) {
      [[self activityList] addObject:userActivity];
    } else {
      userActivity.eligibleForSearch = YES;
      if (@available(iOS 12.0, *)) userActivity.eligibleForPrediction = YES;
    }
    
    delegate.userActivity = userActivity;
    [userActivity becomeCurrent];
    resolve(nil);
  });
}

@end
