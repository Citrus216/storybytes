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

// Test individual images by uncommenting and running node images.js
// (async () => {
//     try {
//         const imageUrl = await getImageUrl('A young boy playing with his dog in the park.');
//         console.log('Generated Image URL:', imageUrl);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

module.exports = {
    getImageUrl
};
