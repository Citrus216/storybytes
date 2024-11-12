
/**
 * This file is used for application logic for story generation. This does not use express.
 */

const OpenAI = require('openai');
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const { textToSpeech, textToSpeechElevenLabs } = require('./audio.js');
const { getImageUrl, getImageUrl_getimgai, getImageUrl_bfl, fetchImage } = require('./images');
const { generatePDF } = require('./pdfs');
const uuid = require('uuid');


const fs = require('fs');
const path = require('path');
// load image urls from default_images.json
const image_urls = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'default_images.json')));

const generateStoryText = async (prompt, level, poemMode, runType = "free") => {
  if (level === undefined) {
    level = "5th";
  }
  const step1 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": prompt},
        {"role": "system", "content": `You are creating a high-level outline for a story based on the input "${prompt}" for readers in grade ${level}. Return exactly 10 plot points. Include multiple characters. Make character appearances in English, NOT the language specified.`}
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
            language: {
              type: "string",
              description: "Name of the language that the story should be written in, based on the input prompt's language and content, written in that language"
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
                    description: "Complete and thorough description of the character's appearance, in English NOT the language specified"
                  }
                }
              },
              description: "Complete and thorough description of all the characters' appearance (in English) and personality"
            },
            plot_points: {
              type: "array",
              items: {
                type: "string",
                description: "Brief summary of each page of the story in the language specified"
              }
            }
          },
          required: ["title", "language", "characters", "plot_points"],
          additionalProperties: false
        }
      }
    }
  });

  const step1Output = step1.choices[0].message.content;
  const outline = JSON.parse(step1Output);
  console.log(outline);

  // const step2Promises = [];
  // step2Promises.push(
  //   openai.chat.completions.create({
  //     model: "gpt-4o",
  //     messages: [
  //         {"role": "user", "content": step1Output},
  //         {"role": "system", "content": `You are creating a cover for the story. The cover should have an image description that includes all the characters' appearances. Do not include the characters' names in the description. Make it efficient and brief.`}
  //     ],
  //     response_format: {
  //       type: "json_schema",
  //       json_schema: {
  //         name: "cover_schema",
  //         schema: {
  //           type: "object",
  //           properties: {
  //             title: {
  //               type: "string"
  //             },
  //             image_description: {
  //               type: "string",
  //               description: "Complete and thorough description of the image for the cover, using the character and setting descriptions from the outline"
  //             }
  //           },
  //           required: ["title", "image_description"],
  //           additionalProperties: false
  //         }
  //       }
  //     }
  //   })
  // );

  // for(let i = 0; i < outline.plot_points.length; i++) {
  //   step2Promises.push(
  //     openai.chat.completions.create({
  //       model: "gpt-4o",
  //       messages: [
  //           {"role": "user", "content": step1Output},
  //           {"role": "system", "content": `You are an author writing page ${i + 1} of a ${poemMode ? "poem" : "story"} for grade ${level}, out of ${outline.plot_points.length}. ${i !== 0 ? `Previous page context: ${outline.plot_points[i]}` : ""} Current page context: ${outline.plot_points[i]} Do not number the page. Return ONLY the page's plain text in the text field. The page should have 3-4 sentences.`},
  //           {"role": "system", "content": `Strictly create this for a child in grade: ${level}. Make the content transition between the previous page and current page.`}
  //       ],
  //       response_format: {
  //         type: "json_schema",
  //         json_schema: {
  //           name: "page_schema",
  //           schema: {
  //             type: "object",
  //             properties: {
  //               text: {
  //                 type: "string"
  //               },
  //               image_description: {
  //                 type: "string",
  //                 description: "Complete and thorough description of the image for the page, using the character and setting descriptions from the outline"
  //               }
  //             },
  //             required: ["text", "image_description"],
  //             additionalProperties: false
  //           }
  //         }
  //       }
  //     })
  //   );
  // }

  // const step2Outputs = await Promise.all(step2Promises);
  // const pages = step2Outputs.map((output) => JSON.parse(output.choices[0].message.content));

  // //construct output object
  // const jsonContent = {
  //   uuid: uuid.v4(),
  //   cover: {
  //     title: outline.title,
  //     image_description: pages[0].image_description
  //   },
  //   story: pages.slice(1).map((page, index) => {
  //     return {
  //       text: page.text,
  //       image_description: page.image_description
  //     };
  //   })
  // }

  const step2 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": step1Output},
        {"role": "system", "content": `You are ${poemMode ? "a poet and illustrator writing a poem" : "an author and illustrator writing a short story"} for children in grade ${level}. All books you write are 10 pages, with each page based on one plot point in the outline provided. Each page has 5 sentences.`},
        {"role": "system", "content": `Write page text and title in ${outline.language}. Write image descriptions in English, NOT the language specified.`}
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
                        description: "Complete and thorough description of the image for the cover, using the character and event descriptions from the outline. Write in English, NOT the language specified."
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
                          description: "Complete and thorough description of the image for the page, using the character and event descriptions from the outline. Write in English."
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
  console.log(jsonContent);

  // Create an array of promises for the cover and story images
  const imagePromises = [];
  const crucialImagePromises = [];

  const getImage = (runType === "free" || runType === "cheap") ? getPaidImage : getImageUrl_bfl;

  const storyId = jsonContent.uuid;

  jsonContent.cover.image = path.join(storyId, `cover.jpg`);
  // Cover image promise
  imagePromises.push(
    getImage(jsonContent.cover.image_description, level).then(async (image) => {
      await fetchImage(storyId, `cover.jpg`, image);
    })
  );
  crucialImagePromises.push(imagePromises[0]);

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
    jsonContent.story[index].image = path.join(storyId, `page${index}.jpg`);
    imagePromises.push(
      getImage(completeDescription, level).then(async (image) => {
        await fetchImage(storyId, `page${index}.jpg`, image);
      }, 
      (error) => {
        console.error(error);
        imagePromises.push(
          getFreeImage(storyItem.image_description, level).then((image) => {
            jsonContent.story[index].image = image;
          })
        );
      })
    );
  });
  crucialImagePromises.push(...imagePromises.slice(1, 3));

  const tts = (runType !== "super expensive" && runType !== "cheap") ? textToSpeech : textToSpeechElevenLabs;

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

  await Promise.all(crucialImagePromises);

  (async () => {
    await Promise.all(imagePromises);
    await generatePDF(storyId, [jsonContent.cover.title, ...jsonContent.story.map((page) => page.text)]);
  })();

  return jsonContent;
}

const getPaidImage = async (prompt, level) => {
  //return await getImageUrl(prompt);
  return await getImageUrl_getimgai(prompt, level);
}

module.exports = {
  generateStoryText
};
