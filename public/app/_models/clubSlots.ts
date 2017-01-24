import { TimeSlot, TimePickerSettings, Club } from './index';

export class ClubSlots {
    constructor(
        public club: Club,
        public morningSettings: TimePickerSettings,
        public lunchSettings: TimePickerSettings,
        public eveningSettings: TimePickerSettings,
        public weekendSettings: TimePickerSettings) {
    }
}