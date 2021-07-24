import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../shared/transaction.service'


@Component({
  selector: 'app-paymentinfo',
  templateUrl: './paymentinfo.component.html',
  styleUrls: ['./paymentinfo.component.css']
})
export class PaymentinfoComponent implements OnInit {
  STATUS: string
  RESPMSG: string

  constructor(private activatedRoute: ActivatedRoute,
              private transactionService: TransactionService,
              private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((Params) => {
      const _id = Params['id']
      this.transactionService.checkTransactionStatus(_id).subscribe(
        (response: {STATUS: string, RESPMSG: string}) => 
        {
          this.STATUS = response.STATUS
          this.RESPMSG = response.RESPMSG
        }
        ,(errorRes) => {
          this.STATUS = 'TXN_FAILURE'
          this.RESPMSG = errorRes
        })
      }
    )
  }

  goHome(){
    this.router.navigate(['/recipes'])
  }


}
