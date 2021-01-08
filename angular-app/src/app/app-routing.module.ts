import{ NgModule } from '@angular/core'
import{ Routes, RouterModule} from '@angular/router'

import { RecipesComponent } from './recipes/recipes.component'
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component'
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component'
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component'
import { RecipesResolverService } from './recipes/recipes-resolver.service'
import { ShoppingListComponent } from './shopping-list/shopping-list.component'
import { AuthenticationGuard } from './authentication/authentication.guard'
import { PurchasedIngredListComponent } from './purchased-ingred-list/purchased-ingred-list.component'
import { AuthenticationComponent } from './authentication/authentication.component'

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { 
        path: 'recipes', 
        component: RecipesComponent, 
        canActivate: [AuthenticationGuard],
        children: [
            { path: '', component: RecipesStartComponent, pathMatch: 'full' },
            { path: 'new', component: RecipeEditComponent },
            { 
                path: ':id', 
                component: RecipeDetailComponent, 
                resolve: [RecipesResolverService] 
            }, 
            { 
                path: ':id/edit', 
                component: RecipeEditComponent, 
                resolve: [RecipesResolverService] 
            }, 
        ], 
        resolve: [RecipesResolverService]
    },
    { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthenticationGuard] },
    { path: 'authentication', component: AuthenticationComponent},
    { path: 'purchased', component: PurchasedIngredListComponent, canActivate: [AuthenticationGuard] }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{

}