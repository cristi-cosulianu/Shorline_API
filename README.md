# Shorline_API

Dependencies: [NodeJS](https://nodejs.org/en/).

# How to run it

1) Clone repository
2) npm install
3) nodemon

# How to use it

After you run the project, open a browser and navigate to [localhost:8080](http://localhost:8080).
Here you can navigate to [/series](http://localhost:8080/series) path to get all the randomly generated series.
To access a specific series you can use tag and id identifiers (default tag0, tag1, tag2, and the id is randomly generated in the uuid format, can be found after nodemon was runned). Also, for series identified using tag or id you will have to provide the following parameters:

1) `startTime` and `endTime` as timestamp in miliseconds.
2) `timeGranularityUnit` and `timeGranularityValue` (optional - default is series timeGranularity)
3) `aggregationFunction` (optional - default is average)

`TimeUnits { second, minut, hour, day }`

`TimeValues { 60, 60, 24, 31 }`

`AggregationFunction { min, max, sum, average, count }`
