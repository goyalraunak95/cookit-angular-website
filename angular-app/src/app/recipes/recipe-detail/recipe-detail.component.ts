import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { DataStoreService } from '../../shared/data-store.service'
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeDetail: Recipe;
  id: string;
  count: number = 0;
  bookmarked: boolean = false;
  loggedInUser: string;
  
  constructor(private shoppingListService: ShoppingListService, 
    private dataStoreService: DataStoreService,
    private route: ActivatedRoute, 
    private recipeService: RecipeService, 
    private router: Router, 
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit(){
    this.loggedInUser = this.authenticationService.user.name
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.recipeDetail = this.recipeService.getRecipeByid(this.id);
        const resId = this.authenticationService.user.bookmarks.find(
          (bookmark) => {
            return bookmark.recipeBookmarkedid === this.recipeDetail._id
          }
        )
       
        if(resId)
        {
          this.bookmarked = true
        }
        else
        {
          this.bookmarked = false
        }
      }
    )
  }

  addIngredToShopping(){
    this.shoppingListService.addIngrediants(this.recipeDetail.ingrediants);
    this.router.navigate(['./shopping-list']);
  }
  editRecipe(){
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  deleteRecipe(){
    this.dataStoreService.deleteRecipe(this.recipeDetail)
    this.router.navigate(['../'],{ relativeTo: this.route });
  }
  onbook(){
    if(this.bookmarked)
    {
      this.bookmarked = !this.bookmarked;
      this.dataStoreService.deleteBookmark(this.recipeDetail)
    }
    else{
      this.bookmarked = !this.bookmarked;
      this.dataStoreService.bookmarkRecipe(this.recipeDetail)
    }
  }
}
