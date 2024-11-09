const OpenAI = require('openai');
const openai = new OpenAI({apiKey: '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'});

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
