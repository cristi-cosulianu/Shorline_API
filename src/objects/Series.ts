import { TimeGranularity } from './TimeGranularity';
import { TimeRange } from './TimeRange';
import uuid from 'uuid/v1';
import { AggregationFunction } from './AggregationFunctions';
import { DataPoint } from './DataPoint';
import * as Constants from '../utils/Constants';
import { throws } from 'assert';

export class Series {

    public id: string;
    public tag: string;
    public dataPoints: DataPoint[];
    public timeRange: TimeRange;
    public timeGranularity: TimeGranularity;

    constructor(tag?: string, timeGranularity?: TimeGranularity, dataPoints?: DataPoint[]) {
        this.id = uuid();
        this.tag = tag;
        this.initializeTimeGranularity(timeGranularity);

        // Is including time range initializing.
        this.initializeDataPoints(dataPoints);
    }

    static copy(series: Series): Series {
        const seriesCopy = new Series();
        seriesCopy.id = series.id;
        seriesCopy.tag = series.tag;
        seriesCopy.dataPoints = JSON.parse(JSON.stringify(series.dataPoints));
        seriesCopy.timeRange = TimeRange.copy(series.timeRange);
        seriesCopy.timeGranularity = Object.assign({}, series.timeGranularity);
        return seriesCopy;
    }

    private initializeDataPoints(dataPoints: DataPoint[]) {
        this.dataPoints = dataPoints ? dataPoints : [];
        this.initializeTimeRange();
    }

    private initializeTimeRange() {
        if (this.dataPoints.length > 0) {
            const firstTimestamp = this.dataPoints[0].timestamp;
            const lastTimestamp = this.dataPoints[this.dataPoints.length - 1].timestamp;

            this.timeRange = new TimeRange(firstTimestamp, lastTimestamp);
        } else {
            this.timeRange = undefined;
        }
    }

    private initializeTimeGranularity(timeGranularity: TimeGranularity) {
        this.timeGranularity = timeGranularity ? timeGranularity : new TimeGranularity(Constants.DEFAULT_TIME_GRANULARITY_UNIT, Constants.DEFAULT_TIME_GRANULARITY_VALUE);
    }

    applyFrame(frameTimeRange: TimeRange) {

        if (!TimeRange.isTimeRange(frameTimeRange)) {
            this.dataPoints = [];
        }

        if (!this.timeRange.includesTimeFrame(frameTimeRange)) {
            this.dataPoints = [];
        }

        this.dataPoints = this.dataPoints.filter(dataPoint => {
            if (frameTimeRange.startTime <= dataPoint.timestamp && dataPoint.timestamp <= frameTimeRange.endTime) {
                return true;
            }

            return false;

        });
    }

    aggregateDataPoints(frameTimeGranularity: TimeGranularity, frameAggregationFunction: AggregationFunction) {
        
        if (frameTimeGranularity.equals(this.timeGranularity)) {
            return;
        }

        if (frameTimeGranularity.compare(this.timeGranularity) < 0) {
            throw new Error("Provided time granularity is lower than the initial time granularity!");
        }

        const aggregatedDatapoints: DataPoint[] = [];

        var buffer: DataPoint[] = [];
        var bound = 0;

        this.dataPoints.forEach(dataPoint => {
            if (dataPoint.timestamp < bound) {
                buffer.push(dataPoint);
            } else {
                if (buffer.length > 0) {
                    aggregatedDatapoints.push(frameAggregationFunction.applyAggregationFunction(buffer));
                }
                buffer = [dataPoint];
                bound = dataPoint.timestamp + frameTimeGranularity.getMiliseconds();
            }
        });

        aggregatedDatapoints.push(frameAggregationFunction.applyAggregationFunction(buffer));

        this.dataPoints = aggregatedDatapoints;
        this.timeGranularity = frameTimeGranularity;
    }

}
