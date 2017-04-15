import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
    public plantDetailMode:string = 'add'; // Modus für die Add / Edit Page
    constructor() {
    }
}
