import "../utils/Utils"

export class TimeRange {
    constructor(public startTime: number, public endTime: number) {}

    static isTimeRange(timeRange: TimeRange): boolean {
        return (timeRange.startTime <= timeRange.endTime);
    }

    static copy(timeRange: TimeRange) {
        const copyStartTime = Number(timeRange.startTime);
        const copyEndTime = Number(timeRange.endTime);
        return new TimeRange(copyStartTime, copyEndTime);
    }

    public includesTimeFrame(frame: TimeRange): boolean {
        return (this.startTime <= frame.startTime &&
            frame.startTime <= frame.endTime &&
            frame.endTime <= this.endTime);
    }

    public validTimestamp(timestamp: number): boolean {
        return (new Date(timestamp)).getTime() > 0;
    }
}