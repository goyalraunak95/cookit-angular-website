import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { Recipe } from '../recipes/recipe.model'
import { RecipeService } from './recipe.service'
import { Observable } from 'rxjs'
import { DataStoreService } from '../shared/data-store.service'
@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private dataStoreService: DataStoreService, 
        private recipeService: RecipeService){}

    resolve(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[]{
        const recipes = this.recipeService.getRecipes();
        if(recipes.length==0)
            return this.dataStoreService.fetchRecipes();
        else    
        {
            //console.log("Already Fetched");
            return recipes;
        }    
    }
}