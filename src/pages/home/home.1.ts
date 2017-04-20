import { Component, Renderer,  } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { PlantsService } from '../../services/plants.service';
import { Plant } from '../../services/plant';
import { AppService } from '../../services/app.service';
import { PlantNotificationService } from '../../services/plant-notification.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations:[ 
  trigger('plantCardAnimation',[
    state('true', style({
        transform: 'scale(1.2)',
      })),
    state('false', style({
    transform: 'scale(1)',
  })), 
  transition('false => true', animate('100ms ease-in')),
    transition('true => false', animate('100ms ease-out')),
  ])]
})
export class HomePage {
  private flipping:boolean;

  constructor(public navCtrl: NavController, public plantsService:PlantsService, 
              public alertCtrl: AlertController,
              private renderer:Renderer, private appService:AppService,
              private plantNotificationService:PlantNotificationService) {
                console.log('plantNotificationService', plantNotificationService);
  }

  public goToAddPage(mode:string, editPlant:Plant):void {
    this.plantsService.plantForEditing = editPlant;
    this.appService.plantDetailMode = mode;
    this.navCtrl.push(AddPage)
  }

  public cardPress(event:any, plant:Plant, card:Element):void {
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
    plant.waterThisPlant();
    this.plantsService.savePlants();
  }

  private showConfirm(plant:Plant) {
    let confirm = this.alertCtrl.create({
      title: 'Delete ' + plant.name +'?',
      message: 'Are you sure you want to delete this plant?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.plantsService.deletePlant(plant);
          }
        }
      ]
    });
    confirm.present();
  }

  public deleteButton(event:Event, plant:Plant):void {
    if (this.flipping) {
      return;
    }
    this.showConfirm(plant);
  }

  public getWaterLevelStyle(plant:Plant):string {
    let scaleX:string = 'scaleX(' + plant.waterLevel + ')';
    return scaleX;
  }

  public get plants():Array<Plant> {
    return this.plantsService.plants;
  }


}

