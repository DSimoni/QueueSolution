import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})


export class BookingComponent implements OnInit {

  services: any[] = [];

  constructor() { }

  ngOnInit(): void { 
    this.services.push({name:'Cash Deposit', description: 'The money you deposit into your bank account or savings account.', icon: 'fa fa-money icon-lg icon-primary icon-bg-primary icon-bg-circle mb-3'});
    this.services.push({name:'Cash Withdrawal', description: 'Removing funds from an account, savings plan, pension, or trust.', icon: 'fa fa-credit-card icon-lg icon-yellow icon-bg-yellow icon-bg-circle mb-3'});
    this.services.push({name:'Current Account Update', description: 'Update (personal or account data)data of current account.', icon: 'fa fa-money icon-lg icon-cyan icon-bg-cyan icon-bg-circle mb-3'});
    this.services.push({name:'Current Account Closure', description: 'The bank finalizes the account number status into Closed.', icon: 'fa fa-home icon-lg icon-red icon-bg-red icon-bg-circle mb-3'});
    this.services.push({name:'Payments', description: 'Money transfer into another account.', icon: 'fa fa-home icon-lg icon-red icon-bg-red icon-bg-circle mb-3'});
    this.services.push({name:'Funds', description: 'Depositing/ freezing money in Investments, Pension Funds.', icon: 'fa fa-user icon-lg icon-orange icon-bg-orange icon-bg-circle mb-3'});
    this.services.push({name:'Debit Card Pick Up', description: 'Customer withdraw the Debit card in branch after card print.               ', icon: 'fa fa-user icon-lg icon-orange icon-bg-orange icon-bg-circle mb-3'});
    this.services.push({name:'Debit Card Closure', description: 'The process of close the debit card.                                         ', icon: 'fa fa-envelope icon-lg icon-blue icon-bg-blue icon-bg-circle mb-3'});
    this.services.push({name:'RON', description: 'Application/Reactivation of  Digital Platform Raiffeisen ON.', icon: 'fa fa-wechat icon-lg icon-purple icon-bg-purple icon-bg-circle mb-3'});
    this.services.push({name:'Current Account Open', description: 'Open an account offered for every currency needed to perform a higher number of transactions.', icon: 'fa fa-wechat icon-lg icon-purple icon-bg-purple icon-bg-circle mb-3'});
    this.services.push({name:'Debit Card Application', description: `Opening a debit card, a payment card that deducts money directly from a consumer's checking account when it is used.`, icon: 'fa fa-search-plus icon-lg icon-green icon-bg-green icon-bg-circle mb-3'});

  }

}
