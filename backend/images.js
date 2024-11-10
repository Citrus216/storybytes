require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function getImageUrl(prompt) {
    styledPrompt = `In the style of a children's story illustration with no text: ${prompt}`;
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: styledPrompt,
            n: 1,
            size: '1024x1024'
        });
        return response.data[0].url;
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

const apiKey = process.env.GETIMGAI_API_KEY;

async function getImageUrl_getimgai(prompt, level) {
    const styledPrompt = `In the style of a story illustration appropriate for grade ${level}: ${prompt}`;
    // const url = 'https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image';
    // const options = {
    //     method: 'POST',
    //     headers: {accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${apiKey}`},
    //     body: JSON.stringify({
    //       model: 'stable-diffusion-xl-v1-0',
    //       prompt: styledPrompt,
    //       negative_prompt: 'Disfigured, blurry',
    //       prompt_2: styledPrompt,
    //       negative_prompt_2: 'Disfigured, blurry',
    //       width: 1024,
    //       height: 1024,
    //       steps: 30,
    //       guidance: 7.5,
    //       output_format: 'jpeg',
    //       response_format: 'url'
    //     })
    //   };
    const url = 'https://api.getimg.ai/v1/flux-dev/text-to-image';
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${apiKey}`},
        body: JSON.stringify({
          prompt: styledPrompt,
          width: 1024,
          height: 1024,
          steps: 6,
          output_format: 'jpeg',
          response_format: 'url'
        })
      };
    const response = await fetch(url, options);
    const data = await response.json();
    return data.url;
}

const bflApiKey = process.env.BFL_API_KEY;

async function getImageUrl_bfl(prompt, level) {
    const styledPrompt = `In the style of a story illustration appropriate for grade ${level}: ${prompt}`;
    const url = 'https://api.bfl.ml/v1/flux-pro-1.1';
    const genResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Key': bflApiKey
        },
        body: JSON.stringify({
          prompt: styledPrompt,
          seed: 42,
          width: 1024,
          height: 1024,
          prompt_upsampling: true,
          safety_tolerance: 2,
          output_format: 'jpeg'
        })
      });
    const genData = await genResponse.json();
    const id = genData.id;

    // Poll the API until the image is ready
    let pending = true;
    let timeout = 500;
    let getData;
    while (pending) {
        const getResponse = await fetch(`https://api.bfl.ml/v1/get_result?id=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Key': bflApiKey
            }
        });
        getData = await getResponse.json();
        if (getData.status === 'Pending') {
            await new Promise(resolve => setTimeout(resolve, timeout));
            timeout += 500;
        } else {
            pending = false;
        }
    }
    return getData.result.sample;
}

// Test individual images by uncommenting and running node images.js
// (async () => {
//     try {
//         const imageUrl = await getImageUrl_bfl('A boy plays in the park with his dog and mother');
//         console.log('Generated Image URL: \n', imageUrl);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

const fs = require('fs');
const path = require('path');

async function fetchImage(id, name, url) {
    const response = await fetch(url);
    let bufferArray = []

    for await (const chunk of response.body) {
        bufferArray.push(chunk);
    }

    const buffer = Buffer.concat(bufferArray);

    //write buffer to file with name the same as the image name
    const fileName = path.join('temp', id, name);
    
    // Make all directories in the path if they do not exist
    fs.mkdirSync(path.dirname(fileName), { recursive: true });

    fs.writeFileSync(fileName, buffer);
}

module.exports = {
    getImageUrl,
    getImageUrl_getimgai,
    getImageUrl_bfl,
    fetchImage
};
