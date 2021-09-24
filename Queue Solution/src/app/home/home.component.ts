import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../_models';
import { AccountService } from '../_services';

@Component({selector: 'app-booking',
 templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    branchName: string = '';
    branchservice: string  = '';
    numberbooked: string  = '';


    constructor(private accountService: AccountService,
        private cookieService: CookieService) {
        this.user = this.accountService.userValue;

         this.initDatafromCookie()
    }

    cancelAppoint()
    {  
        this.cookieService.delete('branchname');
        this.cookieService.delete('branchservice');
        this.cookieService.delete('numberbooked');

        this.initDatafromCookie()
    }

    initDatafromCookie()
    {  
        this.branchName = this.cookieService.get('branchname');
        this.branchservice = this.cookieService.get('branchservice');
        this.numberbooked = this.cookieService.get('numberbooked');
    }
}