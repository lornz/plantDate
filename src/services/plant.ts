import { OnDestroy} from '@angular/core';
import * as moment from 'moment';

export class Plant implements OnDestroy{
  public id:number;
  public name:string;
  public image:string;
  public place:string;
  public comment:string;
  public lastWatered:moment.Moment;
  public waterDays:number; // Tage bis zum nächsten Gießen (initial)
  public nextWaterMoment:moment.Moment;

  private timeUnit:moment.unitOfTime.DurationConstructor = 'minutes'; // debug: 'minutes', release: 'days'
  private updateWaterLevelTimer:number;
  private _waterLevel:number;

  constructor(id_:number, name_:string, image_:string, place_?:string, comment_?:string,
              lastWatered_?:moment.Moment, waterDays_?:number) {
    this.id = id_;
    this.name = name_;
    this.image = image_;
    this.place = place_;
    this.comment = comment_;

    if (lastWatered_) {
      this.lastWatered = lastWatered_;
    }
    else {
      this.lastWatered = moment();
    }

    if (!waterDays_) {
      waterDays_ = 7; // Standard Duration
    }
    this.waterDays = waterDays_;
    this.nextWaterMoment = moment(this.lastWatered).add(this.waterDays + 1, this.timeUnit); // TODO: days statt minutes

    console.log('constructor new Plant', this);

    this.stopWaterTimer();
    this.recalcWaterLevel();
    this.startWaterTimer();
  }

  ngOnDestroy():void {
    this.stopWaterTimer();
    console.log('destroyed Plant', this);
  }

  public getTimeLeftToWater():Date {
    return null;
  }

  public waterThisPlant():void {
    this.lastWatered = moment();
    this.nextWaterMoment = moment(this.lastWatered).add(this.waterDays + 1, this.timeUnit);
    // console.log('waterThisPlant', this.name, 'lastWatered', this.lastWatered, 'nextWaterMoment', this.nextWaterMoment);
    
    this.stopWaterTimer();
    this.recalcWaterLevel();
    this.startWaterTimer();
  }

  public get waterLevel():number {
    return this._waterLevel;
  }

  public set waterLevel(value:number) {
    this._waterLevel = value;
  }

  public get needsToBeWatered():boolean {
    return this.waterLevel <= 0;
  }

  public get lastWateredReadable():string {
    let rightNow:moment.Moment = moment();
    let diff:number = moment(rightNow).diff(this.lastWatered, this.timeUnit);
    if (diff === 0) {
      return 'Today'
    }
    else if (diff === 1) {
      return 'Yesterday'
    }
    else {
      return moment(this.lastWatered).format('DD-MM-YYYY, h:mm a');
    }
  }

  private stopWaterTimer():void {
    if (this.updateWaterLevelTimer) {
      clearInterval(this.updateWaterLevelTimer);
      this.updateWaterLevelTimer = null;
    }
  }

  private startWaterTimer():void {
    this.updateWaterLevelTimer = setInterval(() => {
      this.recalcWaterLevel();
    }, 10000)
  }

  private recalcWaterLevel():void {
    let waterLevel:number = -1 * ((moment().diff(this.nextWaterMoment, this.timeUnit)) / this.waterDays);
    this.waterLevel = waterLevel;

    if (waterLevel <= 0) {
      this.stopWaterTimer();
    }
  }

}