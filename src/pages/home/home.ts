import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { PlantsService, Plant, LoadingState } from '../../services/plants.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  

  constructor(public navCtrl: NavController, public plantsService:PlantsService) {
  }

  public goToAddPage():void {
    this.navCtrl.push(AddPage)
  }

  public get plants():Array<Plant> {
    return this.plantsService.plants;
  }


}

