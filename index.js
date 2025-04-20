const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Allow your Vercel frontend domain
app.use(cors({}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }],
      }
    );

    const reply = result.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

app.get('/', (req, res) => {
  res.send('Gemini Chatbot API is live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
