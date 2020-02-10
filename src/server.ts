import http from 'http';
import uuid from 'uuid/v1';
import app from './app';
import { InMemoryDatabase } from './database/InMemoryDatabase';

// Create in memory database instance;
InMemoryDatabase.getInstance();

const port = 8080;

const server = http.createServer(app);

server.listen(port, 'localhost', () => {
    console.log('Application worker ' + process.pid + ' started...');
});

console.log('Shorline RESTful API server started on: http://localhost:' + port);


