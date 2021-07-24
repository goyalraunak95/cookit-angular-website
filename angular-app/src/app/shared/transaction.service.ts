import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {}

  url: String = `/user/paymentStatus`
  checkTransactionStatus(_id) {
    return this.http.get(this.url+'/'+_id).pipe(catchError((errorRes) => {
      let errorMes = "An unknown error occured";
        if(errorRes.status === 400)
        {
          errorMes = errorRes.error.errorMes
        }
        return throwError(errorMes)
    }))
  }
}
