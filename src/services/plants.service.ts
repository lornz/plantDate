import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class PlantsService {
    public plants:Array<Plant> = [];
    public loadingState:LoadingState = LoadingState.unknown;

    constructor(private storage:Storage) {
        this.loadPlants();
    }

    public addPlant(plant:Plant):void {
        this.plants.splice(0, 0, plant);
    }

    // ID für neue Pflanze generieren
    public getNewId():number {
        return this.plants.length + 1;
    }

    public savePlants():void {
      this.storage.ready().then(() => {
        console.log('savePlants');

        let plantsJSON:string = JSON.stringify(this.plants);
        console.log('savePlants -> plantsJSON', plantsJSON);

        this.storage.set('plants', plantsJSON);
      });
    }

    public loadPlants():void {
      this.storage.ready().then(() => {
        this.loadingState = LoadingState.init;
        this.storage.get('plants').then((val) => {
          this.loadingState = LoadingState.loading;
            let plantsJSON:Array<Plant>;

            // JSON PARSING
            try {
              plantsJSON = JSON.parse(val);
            }
            catch (e) {
              console.warn('ERROR LOADING PLANTS');
              this.loadingState = LoadingState.failed;
              return;
            }

            // Object geladen
            let typeOfPlants = typeof plantsJSON;
            if (typeOfPlants !== 'object') {
              console.warn('ERROR LOADING PLANTS');
              this.loadingState = LoadingState.failed;
              return;
            }

            // Beinhaltet Plant Objects
            plantsJSON.forEach((plant:any) => {
              let typeOfPlant = typeof plant;
              if (typeOfPlant !== 'object') {
                console.warn('ERROR LOADING PLANTS');
                this.loadingState = LoadingState.failed;
                return;
              }
            });


            // Wenn bisher nicht abgebrochen wurde, erfolgreiches laden
            if (plantsJSON) {
              this.plants = plantsJSON;
              this.loadingState = LoadingState.loaded;
            }
          }).catch((e) => {
            console.warn('ERROR LOADING PLANTS');
            this.loadingState = LoadingState.failed;
          });
      }).catch((e) => {
        console.warn('ERROR LOADING PLANTS');
        this.loadingState = LoadingState.failed;
      });
    }
}

export class Plant {
  public id:number;
  public name:string;
  public image:string;
  public place:string;
  public comment:string;

  constructor(id_:number, name_:string, image_:string, place_?:string, comment_?:string) {
    this.id = id_;
    this.name = name_;
    this.image = image_;
    this.place = place_;
    this.comment = comment_;
  }
}

export enum LoadingState {
  unknown,
  init,
  loading,
  failed,
  loaded,
}