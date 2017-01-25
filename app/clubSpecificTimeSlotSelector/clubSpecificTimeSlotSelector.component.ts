// import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// declare var $: any;
// declare var jQueryUi: any;

// import { Club, User, TimePickerSettings } from '../_models/index';
// import { ClubService, UserSlotPreference, AlertService } from '../_services/index';

// @Component({
//     selector: 'club-specific-time-slot-selector',
//     moduleId: module.id,
//     templateUrl: 'clubSpecificTimeSlotSelector.component.html',
//     styleUrls: ['clubSpecificTimeSlotSelector.style.css']
// })

// export class ClubSpecificTimeSlotSelectorComponent implements AfterViewInit {
//     @Input() timePickerSettings: TimePickerSettings;
//     sliderElement: any;
//     rootNode: any;

//     constructor(rootNode: ElementRef) {
//         this.rootNode = rootNode;
//     }

//     enabledChanged(event: any) {
//         this.initSlider();
//     }

//     ngAfterViewInit() {
//         this.sliderElement = $(this.rootNode.nativeElement).find('#slider-range-' + this.timePickerSettings.uuid);
//         this.initSlider();
//     }

//     initSlider() {
//         const self = this;
//         this.sliderElement.slider({
//             disabled: self.timePickerSettings.excluded,
//             range: true,
//             min: this.timePickerSettings.minValue,
//             max: this.timePickerSettings.maxValue,
//             step: 30,
//             values: this.timePickerSettings.values,
//             slide: function (e: any, ui: any) {
//                 var hours1 = Math.floor(ui.values[0] / 60);
//                 var minutes1 = ui.values[0] - (hours1 * 60);

//                 if (hours1.length == 1) hours1 = '0' + hours1;
//                 if (minutes1.length == 1) minutes1 = '0' + minutes1;
//                 if (minutes1 == 0) minutes1 = '00';
//                 if (hours1 >= 12) {
//                 } else {
//                     hours1 = hours1;
//                     minutes1 = minutes1;
//                 }
//                 if (hours1 == 0) {
//                     hours1 = 12;
//                     minutes1 = minutes1;
//                 }

//                 $('.slider-time-' + self.timePickerSettings.uuid).html(hours1 + ':' + minutes1);
//                 self.timePickerSettings.timeSlot.startTime = Number(`${hours1}.${minutes1}`);

//                 var hours2 = Math.floor(ui.values[1] / 60);
//                 var minutes2 = ui.values[1] - (hours2 * 60);

//                 if (hours2.length == 1) hours2 = '0' + hours2;
//                 if (minutes2.length == 1) minutes2 = '0' + minutes2;
//                 if (minutes2 == 0) minutes2 = '00';
//                 if (hours2 >= 12) {
//                 } else {
//                     hours2 = hours2;
//                     minutes2 = minutes2;
//                 }

//                 $('.slider-time2-' + self.timePickerSettings.uuid).html(hours2 + ':' + minutes2);
//                 self.timePickerSettings.timeSlot.endTime = Number(`${hours2}.${minutes2}`);
//             }
//         });
//     }
// }
