import { Injectable } from '@angular/core';

import { TimePickerSettings, TimeSlot } from '../_models/index';

@Injectable()
export class TimePickerSettingsFactory {
    constructor() { }

    createMorningTimePicker(clubId: number, timeSlot: any) {
        let active = timeSlot ? timeSlot.active : false;
        if (!timeSlot) {
            timeSlot = new TimeSlot(clubId, 7, 9, 'weekday', false);
        }
        return new TimePickerSettings("Mornar", timeSlot.active, 360, 660, [timeSlot.startTime * 60, timeSlot.endTime * 60], timeSlot);
    }

    createLunchTimePicker(clubId: number, timeSlot: any) {
        let active = timeSlot ? timeSlot.active : false;
        if (!timeSlot) {
            timeSlot = new TimeSlot(clubId, 12, 13, 'weekday', false);
        }
        return new TimePickerSettings("Luncher", timeSlot.active, 660, 900, [timeSlot.startTime * 60, timeSlot.endTime * 60], timeSlot);
    }

    createEveningTimePicker(clubId: number, timeSlot: any) {
        let active = timeSlot ? timeSlot.active : false;
        if (!timeSlot) {
            timeSlot = new TimeSlot(clubId, 17, 20, 'weekday', false);
        }
        return new TimePickerSettings("Kvällar", timeSlot.active, 900, 1380, [timeSlot.startTime * 60, timeSlot.endTime * 60], timeSlot);
    }

    createWeekendTimePicker(clubId: number, timeSlot: any) {
        let active = timeSlot ? timeSlot.active : false;
        if(!timeSlot) {
            timeSlot = new TimeSlot(clubId, 9, 17, 'weekend', false);
        }
        return new TimePickerSettings("Helger", timeSlot.active, 360, 1380, [timeSlot.startTime * 60, timeSlot.endTime * 60], timeSlot);
    }
}
