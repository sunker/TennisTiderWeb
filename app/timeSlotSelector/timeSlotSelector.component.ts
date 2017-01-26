import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
declare var jQueryUi: any;

import { Club, User, TimePickerSettings } from '../_models/index';
import { ClubService, UserSlotPreference, AlertService, TimePickerSettingsFactory } from '../_services/index';

@Component({
    selector: 'time-slot-selector',
    moduleId: module.id,
    templateUrl: 'timeSlotSelector.component.html',
    styleUrls: ['timeSlotSelector.style.css']
})

export class TimeSlotSelectorComponent implements AfterViewInit {
    @Input() timePickerSettings: TimePickerSettings;
    sliderElement: any;
    rootNode: any;
    viewInitialized = false;
    changesDone = false;
    uuid: string;
    tempIncludedValue: Boolean = false; 
    statusText = '';

    constructor(rootNode: ElementRef, private timePickerSettingsFactory: TimePickerSettingsFactory) {
        this.rootNode = rootNode;
        this.uuid = this.guid();
    }

    refresh() {
        this.initSlider();
    }

    ngOnChanges(changes: any): void {
        var timePickerSettingsChange = changes.timePickerSettings.currentValue;
        if (timePickerSettingsChange != null) {
            this.timePickerSettings = timePickerSettingsChange;
            this.viewInitialized = true;
            this.tempIncludedValue = this.timePickerSettings.include;
            if (this.viewInitialized) this.initSlider();
        }
    }

    enabledChanged(event: any) {
        this.tempIncludedValue = !this.tempIncludedValue;
        this.timePickerSettings.include = this.tempIncludedValue;
        this.initSlider();
    }

    ngAfterViewInit() {
        this.viewInitialized = true;
        if (this.changesDone) this.initSlider();
    }

    initSlider() {
        if (!this.timePickerSettings) return;
        this.sliderElement = $(this.rootNode.nativeElement).find('#slider-range-' + this.uuid);
        const self = this;
        this.sliderElement.slider({
            disabled: !self.timePickerSettings.include,
            range: true,
            min: this.timePickerSettings.minValue,
            max: this.timePickerSettings.maxValue,
            step: 30,
            values: this.timePickerSettings.values,
            slide: function (e: any, ui: any) {
                var hours1 = Math.floor(ui.values[0] / 60).toString();
                var minutes1 = (ui.values[0] - (Number(hours1) * 60)).toString();

                if (hours1.length == 1) hours1 = '0' + hours1;
                if (minutes1.length == 1) minutes1 = '0' + minutes1;
                if (minutes1 == "0") minutes1 = '00';
                if (Number(hours1) >= 12) {
                } else {
                    hours1 = hours1;
                    minutes1 = minutes1;
                }
                if (Number(hours1) == 0) {
                    hours1 = "12";
                    minutes1 = minutes1;
                }

                $('.slider-time-' + self.uuid).html(hours1 + ':' + minutes1);
                self.timePickerSettings.timeSlot.startTime = Number(`${hours1}.${minutes1}`);

                var hours2 = (Math.floor(ui.values[1] / 60)).toString();
                var minutes2 = (ui.values[1] - (Number(hours2) * 60)).toString();

                if (hours2.length == 1) hours2 = '0' + hours2;
                if (minutes2.length == 1) minutes2 = '0' + minutes2;
                if (minutes2 == "0") minutes2 = '00';
                if (Number(hours2) >= 12) {
                } else {
                    hours2 = hours2;
                    minutes2 = minutes2;
                }

                $('.slider-time2-' + self.uuid).html(hours2 + ':' + minutes2);
                self.timePickerSettings.timeSlot.endTime = Number(`${hours2}.${minutes2}`);
            }
        });
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
