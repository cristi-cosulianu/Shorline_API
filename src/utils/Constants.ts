// ---------------------------------- Time range constant values

export enum TimeUnits {
    second = "second",
    minut = "minut",
    hour = "hour",
    day = "day"
}

export enum MaxTimeValueForTimeUnit {
    second = '60',
    minut = '60',
    hour = '24',
    day = '31'
}

export const DEFAULT_TIME_GRANULARITY_VALUE = 1;
export const DEFAULT_TIME_GRANULARITY_UNIT = TimeUnits.second;

// ---------------------------------- Aggregation function constant values

export enum AggregationFunctions {
    min = "min",
    max = "max",
    sum = "sum",
    average = "average",
    count = "count"
}

export const DEFAULT_AGGREGATION_FUNCTION = AggregationFunctions.average;

// ---------------------------------- In memory database constant values

export const DEFAULT_DATABASE_SERIES_NUMBER = 3;
export const DEFAULT_DATAPOINTS_MAX_SIZE = 10;
export const DEFAULT_DATAPOINTS_MAX_VALUE = 10;

