import { Component, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { PlantsService, Plant } from '../../services/plants.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private flipping:boolean;

  constructor(public navCtrl: NavController, public plantsService:PlantsService, private renderer:Renderer) {
  }

  public goToAddPage():void {
    this.navCtrl.push(AddPage)
  }

  public cardPress(event:any, plant:Plant, card:Element):void {
    // console.log('card press', event, plant);
    // event.srcEvent.stopPropagation();
    // event.srcEvent.preventDefault();
    event.stopPropagation();
    event.preventDefault();

   this.flipCard(card, true);
  }

  public flipCard(card:Element, flip:boolean) {
    this.flipping = true;
    this.renderer.setElementClass(card, 'backside', flip);

    setTimeout(() => {
      this.flipping = false;
    }, 600);
  }

  public waterButtonClicked(event:Event, plant:Plant):void {
    console.log('waterButtonClicked', event, plant);
    event.stopPropagation();
    event.preventDefault();
  }

  public deleteButton(event:Event, plant:Plant):void {
    if (this.flipping) {
      return;
    }
    this.plantsService.deletePlant(plant);
  }

  public get plants():Array<Plant> {
    return this.plantsService.plants;
  }


}

