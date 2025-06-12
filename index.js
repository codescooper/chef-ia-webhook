const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const question = req.body.queryResult.queryText;

  try {
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer VOTRE_CLE_OPENAI`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = gptResponse.data.choices[0].message.content;

    return res.json({
      fulfillmentText: answer
    });
  } catch (err) {
    console.error('Erreur GPT :', err.message);
    return res.json({
      fulfillmentText: "Désolé, une erreur est survenue côté IA."
    });
  }
});

app.listen(3000, () => {
  console.log('Serveur webhook en écoute sur le port 3000');
});
