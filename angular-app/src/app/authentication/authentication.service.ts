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
  token: string = null;
  isUserAuthenticated = new BehaviorSubject<boolean>(false);
  url: string = `/user`;
  constructor(private http: HttpClient, 
              private router: Router) { }

  signUp(values: {name: string ,email: string, password: string}) {
    return this.http.post<{user:User,token:string}>(this.url + '/signup', {
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
        this.user = responseData.user
        this.token=responseData.token
        localStorage.setItem('userToken', JSON.stringify(this.token))
        this.isUserAuthenticated.next(true)
      }
    ))
  }

  login(values: {name: string, password: string}) {
    return this.http.post<{user:User,token:string}>(this.url + '/login', {
      name: values.name,
      password: values.password
    })
    .pipe( catchError(
      errorRes => {
        let errorMes = "An unknown error occured";
        console.log('Error response')
        console.log(errorRes)
        if(errorRes.error.errorMes)
          errorMes = errorRes.error.errorMes
        return throwError(errorMes)  
      }
    ))
    .pipe( tap(
      resData => {
        this.user = resData.user
        this.token=resData.token
        localStorage.setItem('userToken', JSON.stringify(this.token))
        this.isUserAuthenticated.next(true)
      }
    ))
  }

  autoLogin(){
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    if(!userToken) {
      return
    }
    this.token=userToken
    this.isUserAuthenticated.next(true)
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
        localStorage.removeItem('userToken')
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
