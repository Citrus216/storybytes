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

const generateStoryText = async (prompt) => {
  // const gptResponse = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [
  //       {"role": "user", "content": prompt},
  //       {"role": "system", "content": "You are an author writing a children's book for children in grades K-2."}
  //   ],
  //   response_format: {
  //       // See /docs/guides/structured-outputs
  //       type: "json_schema",
  //       json_schema: {
  //           name: "story_schema",
  //           schema: {
  //               type: "list",
  //               items: {
  //                   type: "object",
  //                   properties: {
  //                       text: {
  //                           type: "string"
  //                       },
  //                       image_description: {
  //                           type: "string"
  //                       }
  //                   },
  //                   required: ["text", "image_description"],
  //                   additionalProperties: false
  //               },
  //               additionalProperties: false
  //           }
  //       }
  //   }
  // });
  // return gptResponse.choices[0].message.content;
  return default_story;
}

module.exports = {
  generateStoryText
};
