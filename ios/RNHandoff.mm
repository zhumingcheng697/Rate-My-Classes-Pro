//
//  RNHandoff.mm
//  RateMyClassesPro
//
//  Created by McCoy Zhu on 11/22/22.
//

#import "RNHandoff.h"

@implementation RNHandoffModule

RCT_EXPORT_MODULE(RNHandoffModule);

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_REMAP_METHOD(updateUserActivity, activityType:(NSString*)activityType title:(NSString*)title url:(NSString*)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIResponder* delegate = (UIResponder*)[UIApplication sharedApplication].delegate;
    NSUserActivity* userActivity = delegate.userActivity;
    
    if (!activityType) return reject(@"ERROR", @"Activity type cannot be empty", nil);
    
    if (!userActivity || ![userActivity.activityType isEqualToString:activityType]) {
      userActivity = [[NSUserActivity alloc] initWithActivityType:activityType];
    }
    
    if (title) userActivity.title = title;
    
    if (url) userActivity.webpageURL = [NSURL URLWithString:url];
    
    userActivity.eligibleForHandoff = YES;
    delegate.userActivity = userActivity;
    [userActivity becomeCurrent];
    resolve(nil);
  });
}

@end
