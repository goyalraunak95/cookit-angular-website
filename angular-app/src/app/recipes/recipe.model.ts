import { Ingrediant } from '../shared/ingrediant.model';
import { Comment } from '../recipes/comment.model'

export class Recipe{
    
    constructor(public _id: string,
        public name: string,
        public author: string,
        public imagePath: string,
        public recipeDetail: string,
        public ingrediants: Ingrediant[],
        public comments: Comment[]){
       
    }
}