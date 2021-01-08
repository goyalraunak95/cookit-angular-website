import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service'
import { take,map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, 
              private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authenticationService.isUserAuthenticated
      .pipe(take(1), map(
        (isAuthenticated) => {
          if(route.routeConfig.path === "authentication" && isAuthenticated)
            return this.router.createUrlTree(['/recipes'])
          if(isAuthenticated)
            return true
          else
            return this.router.createUrlTree(['/authentication'])
        }
      ))
      
  }
  
}
