require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function getImageUrl(prompt) {
    styledPrompt = `In the style of a children's story illustration, ${prompt}`;
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

async function getImageUrl_getimgai(prompt) {
    const styledPrompt = `In the style of a children's story illustration, ${prompt}`;
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
    const url = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${apiKey}`},
        body: JSON.stringify({
          prompt: styledPrompt,
          width: 1024,
          height: 1024,
          steps: 4,
          output_format: 'jpeg',
          response_format: 'url'
        })
      };
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    console.log(data.url);
    return data.url;
}

// Test individual images by uncommenting and running node images.js
// (async () => {
//     try {
//         const imageUrl = await getImageUrl_getimgai('A cute cat playing with a ball of yarn');
//         console.log('Generated Image URL:', imageUrl);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

module.exports = {
    getImageUrl,
    getImageUrl_getimgai
};
