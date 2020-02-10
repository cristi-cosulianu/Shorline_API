import * as Constants from '../utils/Constants';

export class TimeGranularity {
    constructor(public unit: Constants.TimeUnits, public value: number) {
        this.unit = TimeGranularity.validateUnit(unit) ? unit : Constants.DEFAULT_TIME_GRANULARITY_UNIT;
        this.value = TimeGranularity.validateValue(this.unit, value) ? value : Constants.DEFAULT_TIME_GRANULARITY_VALUE;
    }

    static isTimeGranularity(timeGranularity: TimeGranularity) {
        return TimeGranularity.validateUnit(timeGranularity.unit) && 
                this.validateValue(timeGranularity.unit, timeGranularity.value);
    }

    static validateUnit(unit: Constants.TimeUnits) {
        return Constants.TimeUnits[unit];
    }

    static validateValue(unit: Constants.TimeUnits, value: number) {
        return 0 < value && value <= Number(Constants.MaxTimeValueForTimeUnit[unit]);
    }

    equals(timeGranularity: TimeGranularity) {
        return this.unit === timeGranularity.unit && 
                this.value === timeGranularity.value;
    }

    compare(timeGranularity: TimeGranularity) {
        const timeGranularityUnits = Object.values(Constants.TimeUnits);
        const frameTimeGranularityIndex = timeGranularityUnits.indexOf(timeGranularity.unit);
        const currentTimeGranularityIndex = timeGranularityUnits.indexOf(this.unit);

        if (currentTimeGranularityIndex < frameTimeGranularityIndex) {
            return -1;
        } 
        if (currentTimeGranularityIndex > frameTimeGranularityIndex) {
            return 1;
        }
        if (currentTimeGranularityIndex === frameTimeGranularityIndex) {
            if (this.value === timeGranularity.value) {
                return 0;
            } else if (this.value < timeGranularity.value) {
                return -1;
            } else {
                return 1;
            }
        }
    }

    getMiliseconds(): number {
        switch (this.unit) {
            case Constants.TimeUnits.second:
                return this.value * 1000;
            case Constants.TimeUnits.minut:
                return this.value * 60 * 1000;
            case Constants.TimeUnits.hour:
                return this.value * 60 * 60 * 1000;
            case Constants.TimeUnits.day:
                return this.value * 24 * 60 * 60 * 1000;
        }
    }
} 