
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

const generateStoryText = async (prompt, level, poemMode, runType = "free") => {
  if (level === undefined) {
    level = 12;
  }
  const step1 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": prompt},
        {"role": "system", "content": `You are creating a high-level outline for a story based on the input "${prompt}".`}
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "outline_schema",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            characters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Creative first name for the character, with surname if applicable"
                  },
                  personality: {
                    type: "string",
                    description: "Complete and thorough description of the character's personality"
                  },
                  appearance: {
                    type: "string",
                    description: "Complete and thorough description of the character's appearance"
                  }
                }
              },
              description: "Complete and thorough description of all the characters' appearance and personality"
            },
            setting: {
              type: "string",
              description: "Complete description of when and where the story takes place, including all relevant details"
            },
            conflict: {
              type: "string",
              description: "The main problem or struggle that the characters face in the story"
            },
            resolution: {
              type: "string",
              description: "How the characters solve the main problem or struggle in the story"
            },
            plot_points: {
              type: "array",
              items: {
                type: "string",
                description: "A key event in the story that moves the plot forward"
              }
            }
          },
          required: ["title", "characters", "setting", "conflict", "resolution"],
          additionalProperties: false
        }
      }
    }
  });

  const step1Output = step1.choices[0].message.content;
  const outline = JSON.parse(step1Output);
  console.log(outline);

  const step2 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": step1Output},
        {"role": "system", "content": `You are ${poemMode ? "a poet and illustrator writing a poem" : "an author and illustrator writing a short story"} for children in grade ${level}. All books you write are 10 pages. Each page has 5 sentences.`}
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
                        type: "string",
                        description: "Complete and thorough description of the image for the cover, using the character and setting descriptions from the outline."
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
                          type: "string",
                          description: "Complete and thorough description of the image for the page, using the character and setting descriptions from the outline."
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
  const jsonContent = JSON.parse(step2.choices[0].message.content);
  jsonContent.uuid = uuid.v4();


  // Create an array of promises for the cover and story images
  const imagePromises = [];

  const getImage = (runType === "free") ? getFreeImage : getPaidImage;

  // Cover image promise
  imagePromises.push(
    getImage(jsonContent.cover.image_description).then((image) => {
      jsonContent.cover.image = image;
    })
  );

  // Story images promises
  jsonContent.story.forEach((storyItem, index) => {
    let includedCharacters = [];
    //remove punctuation and split storyItem.text by spaces
    const words = storyItem.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
    //find all words that are included in the character names
    words.forEach((word) => {
      outline.characters.forEach((character) => {
        if (word.toLowerCase() === character.name.toLowerCase() && !includedCharacters.includes(character)) {
          includedCharacters.push(character);
        }
      });
    });
    const completeDescription = `${includedCharacters.map(c => c.appearance).join(", ")}; ${storyItem.image_description}`;
    imagePromises.push(
      getImage(completeDescription).then((image) => {
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


  const tts = (runType !== "expensive" ) ? textToSpeech : textToSpeechElevenLabs;

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
