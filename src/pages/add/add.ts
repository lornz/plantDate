import { Component, ViewChild,  } from '@angular/core';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule }   from '@angular/forms';
import { NavController } from 'ionic-angular';
import { PlantsService, Plant } from '../../services/plants.service';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {
  public idOfNewPlant:number;
  public plantModel = new Plant(null, '', null,);

  plantForm: FormGroup;

  constructor(public navCtrl: NavController, private plantsService:PlantsService, formBuilder: FormBuilder) {
    this.idOfNewPlant = this.plantsService.getNewId();

    this.plantForm = formBuilder.group({
      'name': [this.plantModel.name, Validators.compose([Validators.required, Validators.minLength(2), , Validators.maxLength(25)])],
      'place': this.plantModel.place,
      'comment': this.plantModel.comment,
      'image': this.plantModel.image
    })
  }

  public addPlant(plant_:Plant):void {
    console.log('addPlant', plant_);
    plant_.id = this.plantsService.getNewId();
    plant_.image = 'http://lorempixel.com/400/200/nature/' + plant_.id;
    this.plantsService.addPlant(plant_);

    this.navCtrl.pop()
  }

  public get validPlant():boolean {
    return true;
  }
}
