//
//  HomeViewController.m
//  Cryptor
//
//  Created by Thomas on 5/7/15.
//  Copyright (c) 2015 hackers. All rights reserved.
//

#import "HomeViewController.h"
#import "SendMessageViewController.h"
#import <AFNetworking/AFNetworking.h>

@interface HomeViewController ()

@property (nonatomic, weak) IBOutlet UITextField *pass;
@property (nonatomic, weak) IBOutlet UITextField *email;

@property (nonatomic, weak) IBOutlet UIButton *send;
@property (nonatomic, weak) IBOutlet UIButton *login;

- (IBAction)loginPressed:(id)sender;
- (IBAction)sendPressed:(id)sender;
@end

@implementation HomeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"Home";
    self.send.enabled = NO;
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)loginPressed:(id)sender {
    NSString *password = self.pass.text;
    NSString *userEmail = self.email.text;
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    NSDictionary *params = @{
                             @"email":userEmail,
                             @"password": password
                             };
    
    [manager POST:@"http://10.180.139.164:3000/login" parameters:params success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"not failed");
        BOOL res = [[(NSDictionary *)responseObject valueForKey:@"result"] boolValue];
        NSLog(@"got this far");
        if(res) {
            [[NSUserDefaults standardUserDefaults] setObject:password forKey:@"password"];
            [[NSUserDefaults standardUserDefaults] setObject:userEmail forKey:@"email"];
            self.send.enabled = YES;
        }
        else{
            NSLog(@"bad login info");
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Bad Login"
                                                            message:@"Please try again.."
                                                           delegate:nil
                                                  cancelButtonTitle:@"Okay"
                                                  otherButtonTitles:nil];
            [alert show];
        }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"%@",error.description);
        NSLog(@"failed");
    }];

}
- (IBAction)sendPressed:(id)sender {
    SendMessageViewController *sm = [[SendMessageViewController alloc] init];
    [self.navigationController pushViewController:sm animated:YES];
}

@end
