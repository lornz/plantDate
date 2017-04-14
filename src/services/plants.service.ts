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
        let plantsJSON:string = JSON.stringify(this.plants);
        this.storage.set('plants', plantsJSON);

        if (!this.plantsLoaded) {
          this.loadPlants();
        }
      }).catch((e) => {
        console.warn('0 ERROR SAVING PLANTS', e);
      });;
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
              console.warn('4 ERROR LOADING PLANTS');
              this.loadingState = LoadingState.failed;
              return;
            }

            // Object geladen
            let typeOfPlants = typeof plantsJSON;
            if (typeOfPlants !== 'object') {
              console.warn('3 ERROR LOADING PLANTS');
              this.loadingState = LoadingState.failed;
              return;
            }

            // Beinhaltet Plant Objects
            plantsJSON.forEach((plant:any) => {
              let typeOfPlant = typeof plant;
              if (typeOfPlant !== 'object') {
                console.warn('2 ERROR LOADING PLANTS');
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
            // Das ist ok!
            // console.warn('1 ERROR LOADING PLANTS', e);
            // this.loadingState = LoadingState.failed;
          });
      }).catch((e) => {
        console.warn('0 ERROR LOADING PLANTS', e);
        this.loadingState = LoadingState.failed;
      });
    }

    public get emptyState():boolean {
      return this.plants.length === 0 && this.loadingState !== LoadingState.failed;
    }

    public get plantsLoaded():boolean {
      return this.loadingState === LoadingState.loaded;
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