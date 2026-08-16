require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Link = require('./models/Link');

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Create short link
app.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortCode = nanoid(6); // generates a 6-character code

    const newLink = new Link({ originalUrl, shortCode });
    await newLink.save();

    res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Redirect short link to original URL
app.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });

    if (link) {
      link.clicks += 1;
      await link.save();
      res.redirect(link.originalUrl);
    } else {
      res.status(404).send('Link not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});