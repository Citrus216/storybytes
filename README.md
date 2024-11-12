# StoryBytes

StoryBytes is a JavaScript-based tool by which short stories and poems can be generated about any topic, including images for each page of the story.

### Devpost
This project was created for HackUMass XII. For more information about it, follow the link to our Devpost page below:
https://devpost.com/software/storybytes

## Quickstart guide
1. Create `.env` file in `backend/`
   1. Add OpenAI API key as OPENAI_API_KEY
   2. Add getimg.ai API key as GETIMGAI_API_KEY
   3. Add ElevenLabs API key as ELEVENLABS_API_KEY
2. Start backend server by moving to `backend` directory and executing `npm install` & `npm start`, selecting the desired run mode (see run modes below).
3. Start frontend server by moving to `frontend/my-app` directory and executing `npm install` & `npm start`
4. If it doesn't happen automatically, navigate to http://localhost:3000 in a web browser

### Run modes
#### Free
The free run mode consists of ChatGPT generated text with images powered by [getimg.ai](https://www.getimg.ai)'s API with poor text-to-speech capability.
#### Cheap
The cheap run mode has OpenAI Chat Completions generated text with images generated by [getimg.ai](https://www.getimg.ai)'s API, with [ElevenLabs](https://elevenlabs.io)' humanlike TTS.
#### Expensive
The expensive run mode has Completions generated text with images generated by [Black Forest Labs](https://blackforestlabs.ai/)' Flux 1.1 Pro model via their API with rudimentary TTS. 
#### Super Expensive
The super expensive run mode has Completions generated text with images generated by [Black Forest Labs](https://blackforestlabs.ai/)' Flux 1.1 Pro model, but uses [ElevenLabs](https://elevenlabs.io) TTS.
