import { TimeSlot, TimePickerSettings, Club } from './index';

export class DateAndTime {
    constructor(
        public clubId: number,
        public startTime: number,
        public endTime: number,
        private dayType: string,
        public active: boolean) {
    }
}