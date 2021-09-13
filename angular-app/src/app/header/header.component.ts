import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  subscription: Subscription;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    
    this.subscription = this.authenticationService.isUserAuthenticated.subscribe(
      (isAuthenticate) => {
        this.isAuthenticated = isAuthenticate
      }
    )
  }

  onLogout(){
    this.authenticationService.logout()
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
