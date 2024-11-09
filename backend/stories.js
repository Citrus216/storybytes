
/**
 * This file is used for application logic for story generation. This does not use express.
 */

const OpenAI = require('openai');
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const default_story = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
]

//load image urls from default_images.json
const fs = require('fs');
const { getImageUrl } = require('./images');
const image_urls = JSON.parse(fs.readFileSync('default_images.json', 'utf8'));
for (let i = 0; i < default_story.length; i++) {
  default_story[i].image = image_urls[i];
}

const generateStoryText = async (prompt, level, isFree = true) => {
  if (level === undefined) {
    level = 3;
  }
  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": prompt},
        {"role": "system", "content": `You are an author writing a short story for children in grade ${level}. All books you write are 10 pages. Each page has 5 sentences.`}
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

  // Create an array of promises for the cover and story images
  const imagePromises = [];

  const getImage = isFree ? getFreeImage : getPaidImage;

  // Cover image promise
  imagePromises.push(
    getImage(jsonContent.cover.image_description).then((image) => {
      jsonContent.cover.image = image;
      delete jsonContent.cover.image_description;
    })
  );

  // Story images promises
  jsonContent.story.forEach((storyItem, index) => {
    imagePromises.push(
      getImage(storyItem.image_description).then((image) => {
        jsonContent.story[index].image = image;
        delete jsonContent.story[index].image_description;
      }, 
      (error) => {
        getImage = getFreeImage;
        imagePromises.push(
          getImage(storyItem.image_description).then((image) => {
            jsonContent.story[index].image = image;
            delete jsonContent.story[index].image_description;
          })
        );
      })
    );
  });

  // Wait for all promises to resolve
  await Promise.all(imagePromises);

  return jsonContent;
}

let i = 0

const getFreeImage = async (prompt) => {
  return image_urls[i++ % 11];
}

const getPaidImage = async (prompt) => {
  return await getImageUrl(prompt);
}

module.exports = {
  generateStoryText
};
