import * as Constants from "../utils/Constants";
import { Series } from "../objects/Series";
import { TimeGranularity } from "./TimeGranularity";
import { DataPoint } from "./DataPoint";

export class AggregationFunction {
    constructor(public functionName: string) {
        if (this.isAggregationFunction(this)) {
            this.functionName = functionName;
        } else {
            this.functionName = Constants.DEFAULT_AGGREGATION_FUNCTION;
        }
    }

    isAggregationFunction(aggregationFunction: AggregationFunction) {
        const aggregationFunctions: string[] = Object.values(Constants.AggregationFunctions);
        return aggregationFunctions.indexOf(aggregationFunction.functionName);
    }

    applyAggregationFunction(dataPoints: DataPoint[]): DataPoint {
       switch (this.functionName) {
            case Constants.AggregationFunctions.max: 
                return this.applyMax(dataPoints);
            case Constants.AggregationFunctions.min: 
                return this.applyMin(dataPoints);
            case Constants.AggregationFunctions.average: 
                return this.applyAverage(dataPoints);
            case Constants.AggregationFunctions.count: 
                return this.applyCount(dataPoints);
            case Constants.AggregationFunctions.sum: 
                return this.applySum(dataPoints);
       }
    }

    applyMax(dataPoints: DataPoint[]): DataPoint {
        const aggregatedDataPoint: DataPoint = {
            value: Number.MIN_SAFE_INTEGER,
            timestamp: dataPoints[0].timestamp
        }

        dataPoints.forEach(dataPoint => {
            if (dataPoint.value > aggregatedDataPoint.value) {
                aggregatedDataPoint.value = dataPoint.value;
                aggregatedDataPoint.timestamp = dataPoint.timestamp;
            }
        });

        return aggregatedDataPoint;
    }

    applyMin(dataPoints: DataPoint[]): DataPoint {
        const aggregatedDataPoint: DataPoint = {
            value: Number.MAX_SAFE_INTEGER,
            timestamp: dataPoints[0].timestamp
        }

        dataPoints.forEach(dataPoint => {
            if (dataPoint.value < aggregatedDataPoint.value) {
                aggregatedDataPoint.value = dataPoint.value;
                aggregatedDataPoint.timestamp = dataPoint.timestamp;
            }
        });

        return aggregatedDataPoint;
    }

    applyCount(dataPoints: DataPoint[]): DataPoint {
        const aggregatedDataPoint: DataPoint = {
            value: dataPoints.length,
            timestamp: dataPoints[0].timestamp
        }

        return aggregatedDataPoint;
    }

    applyAverage(dataPoints: DataPoint[]): DataPoint {
        const aggregatedDataPoint: DataPoint = this.applySum(dataPoints);
        aggregatedDataPoint.value /= dataPoints.length;

        return aggregatedDataPoint;
    }

    applySum(dataPoints: DataPoint[]): DataPoint {
        const aggregatedDataPoint: DataPoint = {
            value: 0,
            timestamp: dataPoints[0].timestamp
        };

        dataPoints.forEach(dataPoint => {
            aggregatedDataPoint.value += dataPoint.value;
        });

        return aggregatedDataPoint;
    }
}