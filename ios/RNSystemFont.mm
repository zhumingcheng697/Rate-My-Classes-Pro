//
//  RNSystemFont.mm
//  RateMyClassesPro
//
//  Created by McCoy Zhu on 11/17/22.
//

#import "RNSystemFont.h"

@implementation RNSystemFontModule

RCT_EXPORT_MODULE(RNSystemFontModule);

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)getSystemFontWithDesign:(UIFontDescriptorSystemDesign) fontDesign inSize:(CGFloat) fontSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (@available(iOS 13.0, *)) {
      UIFont* systemFont = [UIFont systemFontOfSize:17];
      
      if (systemFont) {
        UIFontDescriptor *fontDescriptor = systemFont.fontDescriptor;
        
        if (fontDescriptor) {
          fontDescriptor = [fontDescriptor fontDescriptorWithDesign: fontDesign];
          
          if (fontDescriptor) {
            UIFont* systemFontWithDesign = [UIFont fontWithDescriptor:fontDescriptor size:fontSize];
            
            if (systemFontWithDesign) {
              resolve(systemFontWithDesign.fontName);
              return;
            }
          }
        }
      }
      reject(@"Error", @"UNKNOWN", nil);
    } else {
      reject(@"Error", @"NOT_SUPPORTED", nil);
    }
  });
}

RCT_EXPORT_METHOD(getSystemFont:(double)fontSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (@available(iOS 13.0, *)) {
    [self getSystemFontWithDesign:UIFontDescriptorSystemDesignDefault
                           inSize:fontSize
                         resolver:resolve
                         rejecter:reject];
  } else {
    reject(@"Error", @"NOT_SUPPORTED", nil);
  }
}

RCT_EXPORT_METHOD(getSystemSerifFont:(double)fontSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (@available(iOS 13.0, *)) {
    [self getSystemFontWithDesign:UIFontDescriptorSystemDesignSerif
                           inSize:fontSize
                         resolver:resolve
                         rejecter:reject];
  } else {
    reject(@"Error", @"NOT_SUPPORTED", nil);
  }
}

RCT_EXPORT_METHOD(getSystemRoundedFont:(double)fontSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (@available(iOS 13.0, *)) {
    [self getSystemFontWithDesign:UIFontDescriptorSystemDesignRounded
                           inSize:fontSize
                         resolver:resolve
                         rejecter:reject];
  } else {
    reject(@"Error", @"NOT_SUPPORTED", nil);
  }
}

RCT_EXPORT_METHOD(getSystemMonoFont:(double)fontSize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (@available(iOS 13.0, *)) {
    [self getSystemFontWithDesign:UIFontDescriptorSystemDesignMonospaced
                           inSize:fontSize
                         resolver:resolve
                         rejecter:reject];
  } else {
    reject(@"Error", @"NOT_SUPPORTED", nil);
  }
}

@end
