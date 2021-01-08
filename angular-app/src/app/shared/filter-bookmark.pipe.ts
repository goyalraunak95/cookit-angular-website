import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../recipes/recipe.model'
import { AuthenticationService } from '../authentication/authentication.service'

@Pipe({
  name: 'filterBookmark'
})
export class FilterBookmarkPipe implements PipeTransform {

  constructor(private authenticationService: AuthenticationService){}
  transform(value: Recipe[], filterStr: string): any {
    const userx = this.authenticationService.user
    if(value.length === 0 || filterStr === "All")
      return value;
    const resultArray = [];  
    for(let i=0; i<value.length; i++)
    {
      const recipe = userx.bookmarks.find(
        (bookmark) => {
          return bookmark.recipeBookmarkedid === value[i]._id
        }
      )
      if(recipe)
        resultArray.push(value[i])
    }  
    return resultArray
  }

}
