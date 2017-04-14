import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { Validators, FormGroup, FormBuilder }   from '@angular/forms';
import { NavController } from 'ionic-angular';
import { PlantsService, Plant } from '../../services/plants.service';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {
  public plantForm: FormGroup;
  public base64Image: string;

  constructor(public navCtrl: NavController, private plantsService:PlantsService, formBuilder: FormBuilder, private camera:Camera) {

    this.plantForm = formBuilder.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(2), , Validators.maxLength(25)])],
      'place': null,
      'comment': null,
      'image': null
    })
  }

  public addPlant(plant_:Plant):void {
    console.log('addPlant', plant_);
    plant_.id = this.plantsService.getNewId();

    plant_.image = 'http://lorempixel.com/400/200/nature/' + plant_.id;
    if (this.base64Image) {
      plant_.image = this.base64Image;
    }
    this.plantsService.addPlant(plant_);

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
}
