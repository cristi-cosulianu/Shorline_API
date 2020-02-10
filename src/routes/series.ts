import * as Constants from '../utils/Constants';
import express from 'express';
import validate from 'uuid-validate';
import uuid from 'uuid/v1';
import { Series } from '../objects/Series';
import { InMemoryDatabase } from '../database/InMemoryDatabase';
import { AggregationFunction } from '../objects/AggregationFunctions';
import { TimeRange } from '../objects/TimeRange';
import { TimeGranularity } from '../objects/TimeGranularity';

var debug = require('debug')('debug ');

const databaseInstance = InMemoryDatabase.getInstance();
databaseInstance.seriesMap.forEach((entrie) => {
    console.log(entrie);
})

const seriesRoutes = express.Router();

seriesRoutes.get('/', (req, res, next) => {

    let series: Series[] = [];

    databaseInstance.seriesMap.forEach((entrie) => {
        series.push(entrie);
    })

    res.status(200).json({
        all: series
    });
});

seriesRoutes.get('/:identifier', (req, res, next) => {
    const identifier = req.params.identifier;

    // identifier is batch id.
    if (validate(identifier)) {

        // Check exitance of the requested series.
        const requestedSeries = databaseInstance.seriesMap.get(identifier);

        prepareResponseSeries(requestedSeries, identifier, req, res);
        
    } else {
        // Check exitance of the requested series.
        const reuqestedSeriesId = databaseInstance.tagToIdMap.get(identifier);
        const requestedSeries = databaseInstance.seriesMap.get(reuqestedSeriesId);

        prepareResponseSeries(requestedSeries, identifier, req, res);
    }
});

export = seriesRoutes;

function prepareResponseSeries(requestedSeries: Series, identifier: string, req: any, res: any) {

    const query = req.query;
    const timeFrameStart = query.startTime;
    const timeFrameEnd = query.endTime;
    const timeGranularityUnit = query.timeGranularityUnit;
    const timeGranularityValue = query.timeGranularityValue;
    var aggregationFunction = query.aggregationFunction;

    if (!timeFrameStart && !timeFrameEnd && !timeGranularityUnit && !timeGranularityValue && !aggregationFunction) {
        res.status(200).json({
            series: requestedSeries
        });
    }

    if (!requestedSeries) {
        res.status(404).json({
            response: "Requested series not find using '" + identifier + "' identifier"
        });
    }

    // Check validity of the reuqested time frame.
    const timeFrameRange = new TimeRange(timeFrameStart, timeFrameEnd);

    if (!TimeRange.isTimeRange(timeFrameRange)) {
        res.status(404).json({
            response: "Invalid provided time range frame!"
        })
    }

    if (!timeFrameRange.startTime || !timeFrameRange.endTime) {
        res.status(404).json({
            response: "Time frame start and end query parameters required!"
        });
    }

    // Check validity of the reuquested time granularity.
    var timeGranularity = new TimeGranularity(timeGranularityUnit, timeGranularityValue);

    if (timeGranularity.compare(requestedSeries.timeGranularity) < 0) {
        timeGranularity = requestedSeries.timeGranularity;
    }

    // Check validity of the reuqested aggregation function.
    aggregationFunction = new AggregationFunction(query.aggregationFunction);


    // Extract the requested series by applying the frame.
    const responsSeries = Series.copy(requestedSeries);
    responsSeries.applyFrame(timeFrameRange);
    responsSeries.aggregateDataPoints(timeGranularity, aggregationFunction);

    res.status(200).json({
        series: responsSeries
    });

}