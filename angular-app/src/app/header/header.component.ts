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
  userName: string = null
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    
    this.subscription = this.authenticationService.isUserAuthenticated.subscribe(
      (isAuthenticate) => {
        this.isAuthenticated = isAuthenticate
        if(isAuthenticate)
          this.userName = this.authenticationService.user.name
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
