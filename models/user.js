const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['patron', 'artist'], default: 'patron' },
  reviews: [
    {
      artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
      text: String,
    }
  ],
  likedArtworks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }
  ],
  artworks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }
  ],
  workshops: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }
  ],
  followedArtists: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  notifications: [
    {
      type: {
        type: String, 
      },
      content: String, 
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});



userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;