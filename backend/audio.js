require('dotenv').config();
const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');
const { ElevenLabsClient } = require('elevenlabs');

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

function textToSpeechElevenLabs(text, filename = 'output.mp3') {
    return new Promise(async (resolve, reject) => {
      const voiceId = '21m00Tcm4TlvDq8ikWAM';
      const apiKey = process.env.ELEVENLABS_API_KEY;
  
      const tempDir = path.join(__dirname, 'temp');
      const filePath = path.join(tempDir, filename);
  
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
      const data = {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        }
      };
  
      const headers = {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      };
  
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        // Read the response as a buffer
        const audioBuffer = await response.arrayBuffer();
        
        // Write the buffer to an MP3 file
        fs.writeFileSync(filePath, Buffer.from(audioBuffer));
        

        
        resolve(`File saved as ${filePath}`);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Example usage
//   textToSpeechElevenLabs('Hello, this is a test using ElevenLabs.')
//     .then(message => console.log(message))
//     .catch(error => console.error('Error:', error));

module.exports = {
    textToSpeech,
    textToSpeechElevenLabs
};