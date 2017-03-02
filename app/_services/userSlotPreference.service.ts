import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { TimePickerSettingsFactory } from './timePickerSettings.factory';
import { User, Club, TimeSlot, TimePickerSettings, ClubSlots } from '../_models/index';

@Injectable()
export class UserSlotPreference {
    constructor(private http: Http, private timePickerSettingsFactory: TimePickerSettingsFactory) { }

    saveClubs(email: string, clubs: Club[]) {
        let bodyString = JSON.stringify({ "email": email, "clubIds": clubs.map(x => x.id.toString()) });
        return this.http.post('/api/slot/addClubs', bodyString, this.jwt()).map((response: Response) => response.json());
    }

    saveDefaultTimeSlotSettings(email: string, clubSlots: ClubSlots) {
        let bodyString = JSON.stringify({ "email": email, "clubSlot": clubSlots });
        return this.http.post('/api/slot/addDefaultTimeSlotSettings', bodyString, this.jwt()).map((response: Response) => response.json());
    }

    saveClubTimeSlotSettings(email: string, clubSlots: ClubSlots[]) {
        let bodyString = JSON.stringify({ "email": email, "clubSlots": clubSlots });
        return this.http.post('/api/slot/saveClubTimeSlotSettings', bodyString, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getClubSlots(slotPreference: any[]) {
        var result: ClubSlots[] = [];
        slotPreference.forEach((target) => {
            let morningSetting = this.timePickerSettingsFactory.createMorningTimePicker(target.club.id, this.getSlotGroup(target, 2, 6, 11));
            let lunchSetting = this.timePickerSettingsFactory.createLunchTimePicker(target.club.id, this.getSlotGroup(target, 2, 11, 15));
            let eveningSetting = this.timePickerSettingsFactory.createEveningTimePicker(target.club.id, this.getSlotGroup(target, 2, 15, 21));
            let weekendSetting = this.timePickerSettingsFactory.createWeekendTimePicker(target.club.id, this.getSlotGroup(target, 0, 6, 23));
            const clubSlots = new ClubSlots(new Club(target.club.id, target.club.name, target.club.image, target.club.activeForUser, target.club.location), morningSetting, lunchSetting, eveningSetting, weekendSetting);
            result.push(clubSlots);
        });
        return result;
    }

    getSlotGroup(club: any, day: any, startTime: any, endTime: any) {
        let slots: any[] = club.days[day];
        if (!slots || slots[0] !== null) {
            var filtered = slots.filter(x => Number(x.startTime) >= startTime && Number(x.endTime) <= endTime);
            return filtered && filtered[0] ? new TimeSlot(club.clubId, filtered[0].startTime, filtered[0].endTime, '', filtered[0].active) : undefined;
        } else {
            return undefined;
        }
    }

    create(user: User) {
        return this.http.post('/api/user', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': currentUser.token, 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}