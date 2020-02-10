import * as Constants from '../utils/Constants';
import * as Utils from '../utils/Utils';

import { Series } from '../objects/Series';
import { TimeGranularity } from '../objects/TimeGranularity';
import { DataPoint } from '../objects/DataPoint';

export class InMemoryDatabase {
    
    public seriesMap: Map<string, Series>;
    public tagToIdMap: Map<string, string>;

    private static instance: InMemoryDatabase;

    private constructor() {
        this.generateSerires();
    }

    public static getInstance(): InMemoryDatabase {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }

        return InMemoryDatabase.instance;
    }

    private generateSerires() {
        this.seriesMap = new Map();
        this.tagToIdMap = new Map();


        for (let i = 0; i < Constants.DEFAULT_DATABASE_SERIES_NUMBER; i++) {
            const tag = this.generateRandomTag(i);
            const timeGranularity = this.generateRandomTimeGranularity();
            const dataPoints = this.generateRandomDataPoints(timeGranularity);

            const series = new Series(tag, timeGranularity, dataPoints);

            this.seriesMap.set(series.id, series);
            this.tagToIdMap.set(series.tag, series.id);
        }
    }

    private generateRandomTag(number: number): string {
        return 'tag' + number;
    }

    private generateRandomTimeGranularity(): TimeGranularity {
        const timeUnitsArray = Object.values(Constants.TimeUnits);
        const maxTimeValueForTimeUnitArray = Object.values(Constants.MaxTimeValueForTimeUnit);

        return new TimeGranularity(
            timeUnitsArray[Utils.randomInteger(0, timeUnitsArray.length)],
            Number(maxTimeValueForTimeUnitArray[Utils.randomInteger(0, maxTimeValueForTimeUnitArray.length)])
        );
    }

    private generateRandomDataPoints(timeGranularity: TimeGranularity): DataPoint[] {
        const dataPoints: DataPoint[] = [];
        const dataPointsSize = Utils.randomInteger(1, Constants.DEFAULT_DATAPOINTS_MAX_SIZE);
        const startTimestamp = new Date().getTime() - dataPointsSize;

        for (let i = 0; i < dataPointsSize; i++) {
            const value = Utils.randomInteger(0, Constants.DEFAULT_DATAPOINTS_MAX_VALUE);
            const dataPoint: DataPoint = { 
                value: value,
                timestamp: startTimestamp + i * timeGranularity.getMiliseconds()
            };
            dataPoints.push(dataPoint);
        }

        return dataPoints;
    }
}