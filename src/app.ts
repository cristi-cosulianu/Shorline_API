import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import seriesRoutes from './routes/series';

const app = express();

// For body parsing.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Add headers for Cross-Origin.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests.
app.use('/series', seriesRoutes);

// Catch all other routes.
app.use((req, res, next) => {
    const error = new Error('Route not found!');
    // error.status = 404;
    next(error);
});

// Catch all errors from application.
app.use((error: any, req: any, res: any, next: any) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            request: req.body
        }
    });
});

export = app;