import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators'
import { AuthenticationService } from '../authentication/authentication.service'

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authenticationService.isUserAuthenticated.pipe(
      take(1), 
      exhaustMap(isAuthenticate => {
        if(isAuthenticate)
        {
          const modifiedUrl = request.clone({
            headers: request.headers.append('Authorization', this.authenticationService.user.token)
          })
          return next.handle(modifiedUrl)
        }
        return next.handle(request);
      })
    )
  }
}
