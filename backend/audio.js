const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

function textToSpeech(text, filename = 'output.mp3') {
    return new Promise((resolve, reject) => {
        // Define the directory path for the 'temp' folder
        const tempDir = path.join(__dirname, 'temp');

        // Define the full path to save the file in the 'temp' directory
        const filePath = path.join(tempDir, filename);

        // Create all directories that do not exist
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const gtts = new gTTS(text, 'en');

        gtts.save(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`File saved as ${filePath}`);
            }
        });
    });
}

module.exports = {
    textToSpeech,
};