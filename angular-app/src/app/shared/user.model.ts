export class User{

    constructor(public name: string, 
                public email: string, 
                public token: string, 
                public bookmarks: [{
                    _id: string
                    recipeBookmarkedid: string
                }], 
                public publishedRecipes: [{
                    _id: string
                    pubRecipeid: string
                }]){}
}