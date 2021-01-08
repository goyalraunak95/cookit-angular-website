import { Recipe } from "./recipe.model";
import { Comment } from './comment.model';
import { Subject } from 'rxjs';
export class RecipeService{
    // recipes: Recipe[] = [
    //     new Recipe('',
    //     'A Test Recipe 1',
    //     '',
    //     'https://c.pxhere.com/photos/79/70/blur_close_up_cooking_cuisine_delicious_dinner_dish_egg-1568675.jpg!d',
    //     'This is a test 1',
    //     [
    //         new Ingrediant('','Meat',1),
    //         new Ingrediant('','French Fries', 20)
    //     ],
    //     []),
    //     new Recipe('',
    //     'A Test Recipe 2',
    //     '',
    //     'https://c.ndtvimg.com/2019-10/7g6mck6g_biryani-badshah_625x300_25_October_19.jpg',
    //     'This is a test 2',
    //     [
    //         new Ingrediant('','Meat',2),
    //         new Ingrediant('','French Fries', 30)
    //     ],
    //     [])
        
    //   ];
    recipes: Recipe[] = [];
    recipeListChanged = new Subject();
    recipeCommentUpdated = new Subject<Comment[]>()
    getRecipes()
    {
      return this.recipes.slice();
    }
    getRecipe(id: number){
        return this.recipes[id];
    }
    getRecipeByid(_id: string){
        return this.recipes.find((recipe) => {
            return recipe._id === _id
        })
    }
    setRecipes(recipesFetched: Recipe[]){
        this.recipes = recipesFetched;
        this.recipeListChanged.next();
    }
    updateARecipe(updatedRecipe: Recipe) {
        this.recipes.forEach((recipe, index) => {
            if(recipe._id === updatedRecipe._id)
            {
                this.recipes[index] = updatedRecipe
            }
        })
        this.recipeListChanged.next();
    }
    addARecipe(addedRecipe: Recipe) {
        this.recipes.push(addedRecipe)
        this.recipeListChanged.next()
    }
    deleteARecipe(deletedRecipe: Recipe) {
        this.recipes = this.recipes.filter((recipe) => {
            return recipe._id != deletedRecipe._id
        })
        this.recipeListChanged.next()
    }
    postAComment(postedComments: Comment[], updatedRecipeId: string) {

        this.recipes.forEach((recipe, index) => {
            if(recipe._id === updatedRecipeId)
            {
                this.recipes[index].comments = postedComments
            }
        })
        
        this.recipeCommentUpdated.next(postedComments)
    }
}