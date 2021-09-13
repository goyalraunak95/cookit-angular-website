import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: string;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, 
    private recipeService: RecipeService,
    private router: Router, 
    private dataStoreService: DataStoreService, 
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != undefined;
        this.inItForm();
      }
    )
  }

  private inItForm(){
    let name = '';
    let author = '';
    let imagePath = '';
    let recipeDetail = '';
    let recipeIngred = new FormArray([]);
    if(this.editMode)
    {
      const recipe: Recipe = this.recipeService.getRecipeByid(this.id);
      
      name = recipe.name;
      author = recipe.author
      imagePath = recipe.imagePath;
      recipeDetail = recipe.recipeDetail;
      if(recipe.ingrediants)
      {
        for(let ingred of recipe.ingrediants)
        {
          recipeIngred.push(
            new FormGroup({
              'name': new FormControl(ingred.name,Validators.required),
              'amount': new FormControl(ingred.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(name,Validators.required),
      'imagePath': new FormControl(imagePath,Validators.required),
      'recipeDetail': new FormControl(recipeDetail,Validators.required),
      'ingrediants': recipeIngred
    })
    if(!this.editMode)
      this.onAddIngred()
  }
  get controls(){
    return(( this.recipeForm.get('ingrediants') as FormArray ).controls);
  }
   onSubmit(){
    
    if(this.editMode)
    {
      const recipe = this.recipeService.getRecipeByid(this.id)
      const editedRecipe = new Recipe(recipe._id,
      this.recipeForm.get('name').value,
      this.authenticationService.user.name,
      this.recipeForm.get('imagePath').value,
      this.recipeForm.get('recipeDetail').value,
      this.recipeForm.get('ingrediants').value,
      recipe.comments);

      this.dataStoreService.updateRecipe(editedRecipe);
    }
    else  
    {
      const newRecipe = new Recipe('',
      this.recipeForm.get('name').value,
      this.authenticationService.user.name,
      this.recipeForm.get('imagePath').value,
      this.recipeForm.get('recipeDetail').value,
      this.recipeForm.get('ingrediants').value,
      []);
      
      this.dataStoreService.publishRecipe(newRecipe);  
    }
    
    this.router.navigate(['../'],{ relativeTo: this.activatedRoute });
   }

  onAddIngred(){
    (<FormArray>(this.recipeForm.get('ingrediants'))).push(
      new FormGroup({
        'name': new FormControl(null,Validators.required),
        'amount': new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }
  onCancel(){
    this.router.navigate(['../'],{ relativeTo: this.activatedRoute });
  }
  onDeleteIngred(index: number){
    (<FormArray>(this.recipeForm.get('ingrediants'))).removeAt(index)
  }
}
