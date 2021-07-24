import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingrediant } from '../shared/ingrediant.model';
import { ShoppingListService } from "./shopping-list.service";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'] ,
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingrediants = [];
  ingredChangedSubscription: Subscription;
  constructor(private shoppingListService: ShoppingListService, 
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.ingrediants = this.shoppingListService.getIngrediants();
    this.ingredChangedSubscription = this.shoppingListService.ingrediantChanged.subscribe(
      (ingrediant: Ingrediant[]) => {
        this.ingrediants = ingrediant;
      }
    )
  }

  ngOnDestroy(){
    this.ingredChangedSubscription.unsubscribe()
  }

  onEditIngred(index: number){
    this.shoppingListService.startedEditing.next(index);
  }
  onPayment()
  {
    this.http.post('/user/payment',{amount: 500}).subscribe((response) => {
      this.createPaytmForm(response)
    })
  }

  createPaytmForm(params) {
    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'post';
    my_form.action = 'https://securegw-stage.paytm.in/order/process';
    const myParams = Object.keys(params);
    for (let i = 0; i < myParams.length; i++) {
      const key = myParams[i];
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = key;
      my_tb.value = params[key];
      my_form.appendChild(my_tb);
    };
    document.body.appendChild(my_form);
    my_form.submit();
  }

}
