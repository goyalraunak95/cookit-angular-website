import { Injectable } from '@angular/core';
import { User } from '../shared/user.model'
import { HttpClient } from '@angular/common/http'
import { tap, catchError } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: User = null;
  isUserAuthenticated = new BehaviorSubject<boolean>(false);
  url: string = `/user`;
  constructor(private http: HttpClient, 
              private router: Router) { }

  signUp(values: {name: string ,email: string, password: string}) {
    return this.http.post<User>(this.url + '/signup', {
      name: values.name,
      email: values.email,
      password: values.password
    })
    .pipe(catchError(
      (errorRes) => {
        let errorMes = "An unknown error occured";
        if(errorRes.status === 400)
        {
          if(errorRes.error.keyValue.name)
            errorMes = "Username already exists"
          else if(errorRes.error.keyValue.email)
            errorMes = "Email already registered"  
        }
        return throwError(errorMes)
      }
    ))
    .pipe( tap(
      (responseData) => {
        this.user = responseData
        localStorage.setItem('userData', JSON.stringify(this.user))
        this.isUserAuthenticated.next(true)
      }
    ))
  }

  login(values: {name: string, password: string}) {
    return this.http.post<User>(this.url + '/login', {
      name: values.name,
      password: values.password
    })
    .pipe( catchError(
      errorRes => {
        let errorMes = "An unknown error occured";
        if(errorRes.error.errorMes)
          errorMes = errorRes.error.errorMes
        return throwError(errorMes)  
      }
    ))
    .pipe( tap(
      resData => {
        this.user = resData
        localStorage.setItem('userData', JSON.stringify(this.user))
        this.isUserAuthenticated.next(true)
      }
    ))
  }

  autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData'))
    if(!userData) {
      return
    }
    this.user = userData
    this.isUserAuthenticated.next(true)
    this.getUserinfo()
  }

  logout() {
    this.http.post(this.url + '/logout',{})
    .pipe( tap(
      () => {
        this.user = null
        this.isUserAuthenticated.next(false)
      }
    ))
    .subscribe(
      () => {
        localStorage.removeItem('userData')
        this.router.navigate(['/authentication'])
      }
    )
  }

  getUserinfo() {
    this.http.get<User>(this.url + '/')
    .subscribe((userInfo) => {
      this.user = userInfo
    })
  }
}
