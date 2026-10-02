require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Link = require('./models/Link');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 👇 frontend eka (build karapu) serve karanawa
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

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

    // 👇 localhost wenuwata BASE_URL
    res.json({ shortUrl: `${BASE_URL}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Click count eka denawa
app.get('/api/stats/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ clicks: link.clicks, createdAt: link.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
  console.log(`Server running on ${BASE_URL}`);
});