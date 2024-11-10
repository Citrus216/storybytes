
/**
 * This file is used for application logic for story generation. This does not use express.
 */

const OpenAI = require('openai');
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const { textToSpeech, textToSpeechElevenLabs } = require('./audio.js');
const { getImageUrl, getImageUrl_getimgai } = require('./images');
const uuid = require('uuid');


const fs = require('fs');
const path = require('path');
// load image urls from default_images.json
const image_urls = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'default_images.json')));

const generateStoryText = async (prompt, level, poemMode, isFree = true) => {
  if (level === undefined) {
    level = 3;
  }
  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": prompt},
        {"role": "system", "content": `You are ${poemMode ? "a poet writing a poem" : "an author writing a short story"} for children in grade ${level}. All books you write are 10 pages. Each page has 5 sentences.`}
    ],
    response_format: {
        // See /docs/guides/structured-outputs
        type: "json_schema",
        json_schema: {
            name: "story_schema",
            schema: {
                type: "object",
                properties: {
                  cover: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string"
                      },
                      image_description: {
                        type: "string"
                      }
                    }
                  },
                  story: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string"
                        },
                        image_description: {
                          type: "string"
                        }
                      },
                      required: ["text", "image_description"]
                    }
                  }
                },
                additionalProperties: false
            }
        }
    }
  });
  const jsonContent = JSON.parse(gptResponse.choices[0].message.content);
  jsonContent.uuid = uuid.v4();



  // Create an array of promises for the cover and story images
  const imagePromises = [];

  const getImage = isFree ? getFreeImage : getPaidImage;

  // Cover image promise
  imagePromises.push(
    getImage(jsonContent.cover.image_description).then((image) => {
      jsonContent.cover.image = image;
    })
  );

  // Story images promises
  jsonContent.story.forEach((storyItem, index) => {
    imagePromises.push(
      getImage(storyItem.image_description).then((image) => {
        jsonContent.story[index].image = image;
      }, 
      (error) => {
        getImage = getFreeImage;
        imagePromises.push(
          getImage(storyItem.image_description).then((image) => {
            jsonContent.story[index].image = image;
          })
        );
      })
    );
  });


  const tts = isFree ? textToSpeech : textToSpeechElevenLabs;

  // generate audio files for tts for title and then each page
  await tts(jsonContent.cover.title, `${jsonContent.uuid}/title.mp3`);
  await tts(jsonContent.story[0].text, `${jsonContent.uuid}/page0.mp3`);
  // Assumes there is at least one page
  jsonContent.cover.audio = `${jsonContent.uuid}/title.mp3`;
  jsonContent.story[0].audio = `${jsonContent.uuid}/page0.mp3`;

  for(let i = 1; i < jsonContent.story.length; i++) {
    jsonContent.story[i].audio = `${jsonContent.uuid}/page${i}.mp3`;
  }

  (async () => {
    for(let i = 1; i < jsonContent.story.length; i++) {
      await tts(jsonContent.story[i].text, `${jsonContent.uuid}/page${i}.mp3`);
    }
  })();

  return jsonContent;
}

let i = 0

const getFreeImage = async (prompt) => {
  return image_urls[i++ % 11];
}

const getPaidImage = async (prompt) => {
  //return await getImageUrl(prompt);
  return await getImageUrl_getimgai(prompt);
}

module.exports = {
  generateStoryText
};
