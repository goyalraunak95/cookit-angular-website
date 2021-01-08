import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Ingrediant } from 'src/app/shared/ingrediant.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  constructor(private shoppingListService: ShoppingListService) { }
  editMode = false;
  editingIngredIndex: number;
  editSubscription: Subscription;
  editedIngred: Ingrediant;
  @ViewChild('f') slsForm: NgForm;

  ngOnInit(): void {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editingIngredIndex = index;
        this.editedIngred = this.shoppingListService.getIngrediant(index);
        this.slsForm.setValue({
          'name': this.editedIngred.name,
          'amount': this.editedIngred.amount
        });
      }
    )
  }

  onAddIngred(form: NgForm){
    const value = form.value;
    const ingrediant = new Ingrediant('',value.name,value.amount);

    if(this.editMode)
    {
      this.shoppingListService.updateIngrediant(this.editingIngredIndex,ingrediant);
      this.editMode = false;
    }
    else 
      this.shoppingListService.addIngrediant(ingrediant);
    form.reset();  
    
  }
  onIngredDelete(){
    this.slsForm.reset();
    this.shoppingListService.deleteIngrediant(this.editingIngredIndex);
    this.editMode = false;
  }
  onClear(){
    this.slsForm.reset();
  }
  ngOnDestroy(){
    this.slsForm.reset();
    this.editSubscription.unsubscribe();
  }
}
