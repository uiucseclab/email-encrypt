//
//  SendMessageViewController.m
//  Cryptor
//
//  Created by Thomas on 5/4/15.
//  Copyright (c) 2015 hackers. All rights reserved.
//

#import "SendMessageViewController.h"
#import <AFNetworking/AFNetworking.h>
#import <XRSA.h>
#import <Foundation/Foundation.h>
#import <MessageUI/MessageUI.h>

@interface SendMessageViewController () <MFMailComposeViewControllerDelegate>

@property (nonatomic, weak) IBOutlet UITextField *messageField;
@property (nonatomic, weak) IBOutlet UITextField *emailField;

@property (nonatomic, weak) IBOutlet UIButton *sendButton;

@property (nonatomic) NSString *message;
@property (nonatomic) NSString *key;


- (IBAction)sendPressed:(id)sender;

@end

@implementation SendMessageViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)setEnabled:(BOOL)enabled {
    self.messageField.enabled = enabled;
    self.sendButton.enabled = enabled;
    self.emailField.enabled = enabled;
}

- (IBAction)sendPressed:(id)sender {
    NSString *text = self.messageField.text;
    NSString *emailsString = self.emailField.text;
    NSArray *emailStrings = [emailsString componentsSeparatedByString:@","];
    
    [self sendMessage:text toEmails:emailStrings];
}

- (void)sendMessage:(NSString *)message toEmails:(NSArray*)emails {
    [self setEnabled:NO];
    
    NSLog(@"yooooo");
    
    NSString *senderEmail = [[NSUserDefaults standardUserDefaults] objectForKey:@"email"];
    NSString *pass = [[NSUserDefaults standardUserDefaults] objectForKey:@"password"];
    
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    NSDictionary *params = @{
                             @"fromEmail":senderEmail,
                             @"toEmails": [NSArray arrayWithObject:emails],
                             @"password": pass,
                             @"message": message
                             };
    
    [manager POST:@"http://10.180.139.164:3000/encrypt" parameters:params success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"not failed");
        NSArray *keys = [(NSDictionary *)responseObject valueForKey:@"result"];
        NSString *cipher = keys.firstObject;
        NSLog(@"cipher %@", cipher);
        
        
        if([MFMailComposeViewController canSendMail]) {
            MFMailComposeViewController *mailCont = [[MFMailComposeViewController alloc] init];
            mailCont.mailComposeDelegate = self;
            
            [mailCont setToRecipients:emails];
            [mailCont setMessageBody:cipher isHTML:NO];
            
            [self presentViewController:mailCont animated:YES completion:nil];
        }
        
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"%@",error.description);
        NSLog(@"failed");
        [self setEnabled:NO];
    }];
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error {
    [self dismissViewControllerAnimated:YES completion:^{
        [self setEnabled:YES];
    }];
}



@end
