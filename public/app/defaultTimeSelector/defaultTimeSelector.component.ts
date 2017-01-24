import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
import { Club, User, TimePickerSettings, TimeSlot, ClubSlots } from '../_models/index';
import { ClubService, UserSlotPreference, AlertService, TimePickerSettingsFactory, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'defaultTimeSelector.component.html',
    // directives: 
})

export class DefaultTimeSelectorComponent implements AfterViewInit {
    currentUser: User;
    userObj: any;
    clubSlots: ClubSlots;

    constructor(
        private rootNode: ElementRef,
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
                this.clubSlots = this.userSlotPreference.getClubSlots(user.slotPreference.filter(x => x.clubId === -1))[0];
            });
    }

    ngAfterViewInit() {
        var elem = $(this.rootNode.nativeElement).find('#accordion');
        elem.accordion();
    }


    save() {
        // if (this.userObj.firstTimeUser) {
        //     this.userSlotPreference.saveClubTimeSlotSettings(this.currentUser.email, this.clubSlots)
        // }

        // let slots: TimeSlot[] = [];
        // slots = slots.concat(this.clubSlots.morningSettings.timeSlot);
        // slots = slots.concat(this.clubSlots.eveningSettings.timeSlot);
        // slots = slots.concat(this.clubSlots.lunchSettings.timeSlot);
        // slots = slots.concat(this.clubSlots.weekendSettings.timeSlot);

        this.userSlotPreference.saveDefaultTimeSlotSettings(this.currentUser.email, this.clubSlots)
            .subscribe((data) => {
                this.router.navigateByUrl('/valj-klubbtider');
            });
    }
}
