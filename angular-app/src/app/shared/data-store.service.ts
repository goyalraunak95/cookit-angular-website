import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Recipe } from '../recipes/recipe.model'
import { Comment } from '../recipes/comment.model'
import { RecipeService } from '../recipes/recipe.service';
import { tap } from 'rxjs/operators'
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from './user.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  url: string = `/recipe`;
  urlforBookmark: string = `/user`
  constructor(private http: HttpClient, 
              private recipeService: RecipeService, 
              private authenticationService: AuthenticationService) { }

  publishRecipe(recipe: Recipe) {
    this.http.post<{recipe: Recipe, user: User}>(this.url, recipe
      
    )
    .subscribe(
      (responseData) => {
        this.recipeService.addARecipe(responseData.recipe)
        this.authenticationService.user = responseData.user
      }
    )
  } 
  
  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url)
    .pipe( tap(
      (responseData) => {
        this.recipeService.setRecipes(responseData)
      }
    ))
  }

  updateRecipe(recipe: Recipe) {
    const recipeId = recipe._id
    this.http.patch<Recipe>(this.url + '/' + recipeId, recipe)
    .subscribe(
      (responseData) => {
        this.recipeService.updateARecipe(responseData)
      }
    )
  }

  deleteRecipe(recipe: Recipe) {
    const recipeId = recipe._id
    this.http.delete<Recipe>(this.url + '/' + recipeId)
    .subscribe(
      (responseData) => {
        this.recipeService.deleteARecipe(responseData)
      }
    )
  }

  postComment(comment: Comment, recipe: Recipe) {
    const recipeId = recipe._id
    this.http.post<Comment[]>(this.url + '/comment/' + recipeId, comment)
    .subscribe(
      (responseData) => {
        this.recipeService.postAComment(responseData,recipeId)
      }
    )
  }

  bookmarkRecipe(recipe: Recipe) {
    this.http.post<[{_id: string, recipeBookmarkedid: string}]>(this.urlforBookmark + '/bookmark', {
      recipeBookmarkedid: recipe._id
    })
    .subscribe(
      resData => {
        this.authenticationService.user.bookmarks = resData
      }
    )
  }

  deleteBookmark(recipe: Recipe) {
    this.http.delete<[{_id: string, recipeBookmarkedid: string}]>(this.urlforBookmark + '/bookmark/' + recipe._id)
    .subscribe(
      resData => {
        this.authenticationService.user.bookmarks = resData
      }
    )
  }
}
