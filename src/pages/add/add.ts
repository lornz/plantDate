import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { Validators, FormGroup, FormBuilder }   from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AppService } from '../../services/app.service';
import { PlantsService } from '../../services/plants.service';
import { Plant } from '../../services/plant';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {
  public plantForm: FormGroup;
  public base64Image: string;

  constructor(public navCtrl: NavController, private plantsService:PlantsService, 
              private formBuilder: FormBuilder, private camera:Camera,
              private appService:AppService) {

    this.plantForm = formBuilder.group({
      'name': [this.plantForEditing ? this.plantForEditing.name : null, Validators.compose([Validators.required, Validators.minLength(2), , Validators.maxLength(25)])],
      'place': this.plantForEditing ? this.plantForEditing.place : null,
      'comment': this.plantForEditing ? this.plantForEditing.comment : null,
      'waterDays': this.plantForEditing ? this.plantForEditing.waterDays : 5
    })
  }

  public savePlant(plantData:Plant):void {
    console.log('savePlant', plantData, 'plantForEditing', this.plantForEditing);
    plantData.id = this.plantForEditing ? this.plantForEditing.id : this.plantsService.getNewId();
    plantData.image = this.plantImage;
    plantData.lastWatered = this.plantForEditing ? this.plantForEditing.lastWatered : null;
    // plantData.image = 'http://lorempixel.com/400/200/nature/' + plantData.id;
    // if (this.base64Image) {
    //   plantData.image = this.base64Image;
    // }
    let plant_:Plant = new Plant (
      plantData.id,
      plantData.name,
      plantData.image,
      plantData.place,
      plantData.comment,
      plantData.lastWatered,
      plantData.waterDays
    )
    

    if (this.plantForEditing) {
      this.plantsService.replacePlant(this.plantForEditing, plant_);
    }
    else {
      this.plantsService.addPlant(plant_);
    }

    this.navCtrl.pop()
  }

  /**
   * native!
   */
  public takePicture(event:Event){
    // form submit prevent
    event.stopPropagation();
    event.preventDefault();

    this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1600,
        targetHeight: 800,
        quality: 80,
        correctOrientation: true
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }

  public get isInAddMode():boolean {
    return this.appService.plantDetailMode === 'add';
  }

  public get plantForEditing():Plant {
    return this.plantsService.plantForEditing;
  }

  private get plantImage():string {
    if (this.base64Image) {
      return this.base64Image;
    }
    else if (this.plantForEditing && this.plantForEditing.image) {
      return this.plantForEditing.image;
    }
    else {
      'http://lorempixel.com/400/200/nature/' + 10;
    }
  }
}
