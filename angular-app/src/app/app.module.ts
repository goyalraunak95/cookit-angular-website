import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipeService } from './recipes/recipe.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module'
import { RecipesComponent } from './recipes/recipes.component'
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component'
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component'
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component'
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component'
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component'
import { ShoppingListComponent } from './shopping-list/shopping-list.component'
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component'
import { DropdownDirective } from './shared/dropdown.directive'
import { AlertComponent } from './shared/alert.component'
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component' 
import { CommentListComponent } from './recipes/recipe-detail/comment-list/comment-list.component';
import { CommentItemComponent } from './recipes/recipe-detail/comment-list/comment-item/comment-item.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { FilterBookmarkPipe } from './shared/filter-bookmark.pipe';
import { PaymentinfoComponent } from './paymentinfo/paymentinfo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipesStartComponent,
    RecipeEditComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    AlertComponent,
    LoadingSpinnerComponent,
    CommentListComponent,
    CommentItemComponent,
    AuthenticationComponent,
    FilterBookmarkPipe,
    PaymentinfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [RecipeService,ShoppingListService, 
              {provide: HTTP_INTERCEPTORS, 
              useClass: AuthenticationInterceptor, 
              multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
