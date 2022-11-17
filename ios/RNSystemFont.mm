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

RCT_REMAP_METHOD(getSystemFont, fontSize:(double) fontSize  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self getSystemFontWithDesign:UIFontDescriptorSystemDesignDefault
                         inSize:fontSize
                       resolver:resolve
                       rejecter:reject];
}

RCT_REMAP_METHOD(getSystemSerifFont, serifFontSize:(double) fontSize  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self getSystemFontWithDesign:UIFontDescriptorSystemDesignSerif
                         inSize:fontSize
                       resolver:resolve
                       rejecter:reject];
}

RCT_REMAP_METHOD(getSystemRoundedFont, roundedFontSize:(double) fontSize  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self getSystemFontWithDesign:UIFontDescriptorSystemDesignRounded
                         inSize:fontSize
                       resolver:resolve
                       rejecter:reject];
}

RCT_REMAP_METHOD(getSystemMonoFont, monoFontSize:(double) fontSize  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self getSystemFontWithDesign:UIFontDescriptorSystemDesignMonospaced
                         inSize:fontSize
                       resolver:resolve
                       rejecter:reject];
}

@end
