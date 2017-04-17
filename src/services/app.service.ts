import { Injectable } from '@angular/core';
import { PlantNotificationService } from './plant-notification.service';
import { PlantsService } from './plants.service';

@Injectable()
export class AppService {
    public plantDetailMode:string = 'add'; // Modus für die Add / Edit Page
    constructor(public plantsService:PlantsService, public plantNotificationService:PlantNotificationService) {

        this.plantNotificationService.plantsService = this.plantsService;
        this.plantsService.plantNotificationService = this.plantNotificationService;
    }
}
