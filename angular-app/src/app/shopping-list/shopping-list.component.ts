import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingrediant } from '../shared/ingrediant.model';
import { ShoppingListService } from "./shopping-list.service";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
              private router: Router) { }

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
  onBuy(){
    this.router.navigate(['/purchased']);
  }
}
