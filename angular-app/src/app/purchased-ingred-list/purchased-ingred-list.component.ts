import { Component, OnInit } from '@angular/core';
import { Ingrediant } from '../shared/ingrediant.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Component({
  selector: 'app-purchased-ingred-list',
  templateUrl: './purchased-ingred-list.component.html',
  styleUrls: ['./purchased-ingred-list.component.css']
})
export class PurchasedIngredListComponent implements OnInit {

  ingrediants: Ingrediant[] = []
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingrediants = this.shoppingListService.getIngrediants()
  }

}
