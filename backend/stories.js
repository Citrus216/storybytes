/**
 * This file is used for application logic for story generation. This does not use express.
 */

const OpenAI = require('openai');
const openai = new OpenAI({apiKey: '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'});

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
const image_urls = JSON.parse(fs.readFileSync('default_images.json', 'utf8'));
for (let i = 0; i < default_story.length; i++) {
  default_story[i].image = image_urls[i];
}

const generateStoryText = async (prompt, level) => {
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
  // first do cover image
  jsonContent.cover.image = await getImage(jsonContent.cover.image_description);
  delete jsonContent.cover.image_description;
  // then do story images
  for (let i = 0; i < jsonContent.story.length; i++) {
    jsonContent.story[i].image = await getImage(jsonContent.story[i].image_description);
    delete jsonContent.story[i].image_description;
  }
  return jsonContent;
}

let i = 0

const getImage = async (prompt) => {
  return image_urls[i++ % 11];
}

module.exports = {
  generateStoryText
};
