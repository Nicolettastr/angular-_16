import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    if (form.invalid) {
      alert('Formulario inválido - completa todos los campos');
      return;
    }

    const value = form.value;
    const amount = parseFloat(value.amount);

    if (amount < 1) {
      alert('El amount debe ser un número mayor o igual a 1');
      return;
    }

    const newIngredient = new Ingredient(value.name.trim(), amount);

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }

    form.reset();
  }

  onClearForm() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClearForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
