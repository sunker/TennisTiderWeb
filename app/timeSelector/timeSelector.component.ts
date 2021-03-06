﻿import { Component, OnInit, Input, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Club, User, TimePickerSettings, TimeSlot, ClubSlots } from '../_models/index';
import { ClubService, UserSlotPreference, AlertService, TimePickerSettingsFactory } from '../_services/index';
import { TimeSlotSelectorComponent } from '../timeSlotSelector/index';

@Component({
    selector: 'time-selector',
    moduleId: module.id,
    templateUrl: 'timeSelector.component.html'
})

export class TimeSelectorComponent implements AfterViewInit {
    @Input() clubSlots: any;
    model: any = {};
    currentUser: User;
    loading = false;

    constructor(
        private router: Router,
        private userSlotPreference: UserSlotPreference,
        private alertService: AlertService,
        private timePickerSettingsFactory: TimePickerSettingsFactory) {
        this.currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
    }

    ngOnChanges(changes: any): void {
        var settingsChange = changes.clubSlots.currentValue;
        if (settingsChange) {
        }
    }

    @ViewChildren(TimeSlotSelectorComponent) child: QueryList<TimeSlotSelectorComponent>;

    ngAfterViewInit() {
        this.child.forEach(child => child.refresh());
    }

    // save() {
    //     let slots: TimeSlot[] = [];
    //     if (!this.clubSlots.morningSettings.excluded) {
    //         slots = slots.concat(this.morningSettings.timeSlot);
    //     }
    //     if (!this.clubSlots.eveningSettings.excluded) {
    //         slots = slots.concat(this.eveningSettings.timeSlot);
    //     }
    //     if (!this.clubSlots.lunchSettings.excluded) {
    //         slots = slots.concat(this.lunchSettings.timeSlot);
    //     }
    //     if (!this.clubSlots.weekendSettings.excluded) {
    //         slots = slots.concat(this.weekendSettings.timeSlot);
    //     }

    //     this.userSlotPreference.saveDefaultTimeSlotSettings(this.currentUser.email, slots)
    //         .subscribe((data) => {
    //             this.router.navigateByUrl('/home');
    //         });
    // }
}
