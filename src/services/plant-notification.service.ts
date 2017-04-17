import { Injectable } from '@angular/core';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { Plant } from './plant';
import { PlantsService } from './plants.service';

@Injectable()
export class PlantNotificationService {
    public notifications:LocalNotifications;
    public plantsService:PlantsService;
    constructor(private localNotifications:LocalNotifications) {
        this.localNotifications.registerPermission();
    }

    public updateNotifications():void {
        this.localNotifications.cancelAll();
        this.plantsService.plants.forEach((plant:Plant) => {
            let date:Date = new Date();
            if (plant.nextWaterMoment.toDate() > date) {
                console.log('CreateNotification at', plant.nextWaterMoment.toDate(), 'for ', plant.name);
                let notification:ILocalNotification = this.getNotificationObject(plant);
                this.localNotifications.schedule(notification);
                // this.createNotification(plant.nextWaterMoment.toDate(), plant);
            }
            else {
                console.log('schon tot', plant.name);
            }
        });
    }

    public updateNotification(plant:Plant) {
        console.log('updateNotification for', plant.name)
        let notification:ILocalNotification = this.getNotificationObject(plant);
        this.localNotifications.update(notification);
    }

    private getNotificationObject(plant:Plant):ILocalNotification {
        if (plant) {
            let notification:ILocalNotification = {
                id: plant.id,
                title: 'Plant Date',
                text: plant.name + ' is thirsty!',
                at: plant.nextWaterMoment.toDate(),
                led: 'FF0000',
                sound: null
            };

            return notification;
        }
        else {
            return null;
        }
    }
}

