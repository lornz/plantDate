import { Injectable } from '@angular/core';
import { Plant } from './plant'
import { Storage } from '@ionic/storage';

@Injectable()
export class PlantsService {
    public plants:Array<Plant> = [];
    public plantForEditing:Plant;
    public loadingState:LoadingState = LoadingState.unknown;

    constructor(private storage:Storage) {
        this.loadPlants();
    }

    public addPlant(plant:Plant):void {
        this.plants.splice(0, 0, plant);
        this.savePlants();
    }

    public deletePlant(plantToDelete:Plant):void {
      // console.log('deletePlant', plantToDelete);
      this.plants.forEach((plant:Plant, index:number) => {
        if (plant.id === plantToDelete.id) {
          this.plants.splice(index, 1);
          this.savePlants();
          return;
        }
      });
    }

    public replacePlant(plantToDelete:Plant, plantToAdd:Plant):void {
      // console.log('replacePlant', plantToDelete, plantToAdd);
       this.plants.forEach((plant:Plant, index:number) => {
        if (plant.id === plantToDelete.id) {
          this.plants.splice(index, 1, plantToAdd);
          this.savePlants();
          return;
        }
      });
    }

    // ID für neue Pflanze generieren
    public getNewId():number {
      if (this.plants && this.plants.length > 0) {
        return this.plants[0].id + 1; // Da neue Pflanzen immer VORNE angefügt werden
      }
      else {
        return 0;
      }
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
              plantsJSON.forEach((plant:Plant) => {
                let createdPlant:Plant = new Plant(plant.id, plant.name, plant.image, plant.place, plant.comment, plant.lastWatered, plant.waterDays);
                this.plants.push(createdPlant);
              });
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

export enum LoadingState {
  unknown,
  init,
  loading,
  failed,
  loaded,
}