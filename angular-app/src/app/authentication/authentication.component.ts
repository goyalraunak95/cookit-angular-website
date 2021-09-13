import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AuthenticationService } from './authentication.service'

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  constructor(private authenticationService: AuthenticationService, 
    private router: Router, 
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authenticationForm: NgForm) {
    this.isLoading = true;
    this.error = null;
    this.shoppingListService.ingrediants = []
    
    if(this.isLoginMode)
    {
      this.authenticationService.login(authenticationForm.value)
      .subscribe(
        () => {
          this.isLoading = false
          this.router.navigate(['/recipes'])
        }, 
        errorres => {
          this.error = errorres
          this.isLoading = false
        }
      )
    }
    else
    {
      this.authenticationService.signUp(authenticationForm.value)
      .subscribe(
        () => {
          this.isLoading = false
          this.router.navigate(['/recipes'])
        }, 
        (errorres) => {
          this.error = errorres
          this.isLoading = false
        }
      )
    }
  }

  onHandleError(){
    this.error=null;
  }

}
