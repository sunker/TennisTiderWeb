import { AfterViewInit, Directive, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Club, User, TimePickerSettings, TimeSlot, ClubSlots } from '../_models/index';
import { ClubService, UserSlotPreference, AlertService, TimePickerSettingsFactory, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'slotMonitor.component.html'
})

export class SlotMonitorComponent {
    currentUser: User;
    userObj: any;
    clubs: Club[];

    constructor(
        private router: Router,
        private userSlotPreference: UserSlotPreference,
        private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
        this.userService.getByEmail(this.currentUser.email)
            .subscribe((user: any) => {
                if (user.success === false) {
                    this.router.navigateByUrl('/logga-in');
                }
                this.userObj = user;
                this.clubs = user.slotPreference.map((x: any) => x.club).filter(x => x.id !== -1);;
            });
    }

    save() {
        // this.userSlotPreference.saveClubTimeSlotSettings(this.currentUser.email, this.clubSlots)
        //     .subscribe((data) => {
        //         if (this.userObj.firstTimeUser) {
        //             this.router.navigateByUrl('/valj-bastid');
        //         } else {
        //             this.router.navigateByUrl('/home');
        //         }
        //     });
    }
}
