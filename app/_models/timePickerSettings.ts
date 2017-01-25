import { TimeSlot } from './index';

export class TimePickerSettings {
    constructor(
        public header: string,
        public include: Boolean,
        public minValue: number,
        public maxValue: number,
        public values: number[],
        public timeSlot: TimeSlot) {
    }

    // static default() {
    //     return new this("", false, 0, 0, [], new TimeSlot(0, 0, 0 , ""));
    // }
}