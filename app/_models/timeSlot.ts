export class TimeSlot {
    constructor(
        public clubId: number,
        public startTime: number,
        public endTime: number,
        private dayType: string,
        public active: boolean) {
    }

    get period() {
        if (this.startTime <= 11) {
            return 'morning'
        } else if (this.startTime <= 15) {
            return 'lunch'
        } else if (this.startTime <= 23) {
            return 'evening'
        }
    }
}