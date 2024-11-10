require('dotenv').config();
const express = require('express');
const storyEndpoints = require('./story_endpoints');
const dictEndpoints = require('./dict_endpoints');
const fileServer = require('./file-server');
const config = require('./config'); // Import config.js
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());

// Middleware to check if run type is set
app.use(config.checkRunType); // This will prevent access to endpoints until run type is set

// Use the endpoints
app.use('', fileServer);
app.use('/api/v1', storyEndpoints);
app.use('/api/v1', dictEndpoints);

// Prompt user for run type
function promptRunType() {
    console.log('Please enter "f" for free run, "c" for cheap run, or "e" for expensive run:');
    process.stdin.on('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        if (input === 'f') {
            config.setRunType('free');
            console.log('Run type set to free. (Default Images, Free TTS)');
            startServer();
        } else if (input === 'c') {
            config.setRunType('cheap');
            console.log('Run type set to cheap. (GetImgAI Images, Free TTS)');
            startServer();
        } else if (input === 'e') {
            config.setRunType('expensive');
            console.log('Run type set to expensive. (GetImgAI Images, ElevenLabs TTS)');
            startServer();
        } 
        else {
            console.log('Invalid input. Please enter "f", "c", or "e".');
        }
    });
}

// Start the Express server
function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

function deleteTemp() {
    const fs = require('fs');
    const path = require('path');

    const storyPath = path.join(__dirname, 'temp');
    if(!fs.existsSync(storyPath)) {
        return
    }
    fs.rmSync(storyPath, {recursive: true, force: true});
}

// Listen for termination signals
process.on('SIGINT', () => {
    console.log('Received SIGINT. Cleaning up...');
    deleteTemp();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Cleaning up...');
    deleteTemp();
    process.exit();
});

// Optionally, handle unexpected exits
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}. Cleaning up...`);
    deleteTemp();
});

// Prompt for run type on startup
promptRunType();