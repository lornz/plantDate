import { Injectable } from '@angular/core';

@Injectable()
export class PlantsService {
    public plants:Array<Plant> = [];

    constructor() {
        console.log('plants service')

        this.initPlants();
    }

    public addPlant(plant:Plant):void {
        this.plants.splice(0, 0, plant);
    }

    // ID für neue Pflanze generieren
    public getNewId():number {
        return this.plants.length + 1;
    }

    // fake plants
    private initPlants():void {
    for (let i:number = 0; i < 6; i++) {
      this.plants[i] = new Plant(i, 'PlantName -' + i, 'http://lorempixel.com/400/200/nature/' + i);
    }
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