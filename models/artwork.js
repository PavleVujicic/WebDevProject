const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: String,
  category: String,
  medium: String,
  description: String,
  poster: String,
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
    }
  ],
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;