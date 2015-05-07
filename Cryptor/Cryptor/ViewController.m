//
//  ViewController.m
//  Cryptor
//
//  Created by Thomas on 5/4/15.
//  Copyright (c) 2015 hackers. All rights reserved.
//

#import "ViewController.h"
#import "SendMessageViewController.h"
#import "HomeViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
}

- (void)viewDidAppear:(BOOL)animated {
    HomeViewController *home = [[HomeViewController alloc] init];
    UINavigationController *controller = [[UINavigationController alloc] initWithRootViewController:home];
    [self presentViewController:controller animated:NO completion:nil];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
