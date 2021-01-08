import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {

  recipes: Recipe[] = [];
  subscription: Subscription;
  filterStr: string = "All"
  constructor(private recipeService: RecipeService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.subscription = this.recipeService.recipeListChanged.subscribe(
      () => {
        this.recipes = this.recipeService.getRecipes();
      }
    )
    
  }

  addRecipe(){
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
