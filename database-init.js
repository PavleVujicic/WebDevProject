const mongoose = require('mongoose');
const fs = require('fs');

const User = require('./models/user');
const Artwork = require('./models/artwork');
const Workshop = require('./models/workshop');

mongoose.connect('mongodb://localhost/store22', { useNewUrlParser: true, useUnifiedTopology: true });


const initializeGalleryData = async () => {
  try {
    
    const data = fs.readFileSync('gallery.json', 'utf8');
    const galleryData = JSON.parse(data);

    
    const users = [
      { username: 'pavle1', password: '123', accountType: 'patron' },
      { username: 'pavle2', password: '123', accountType: 'patron' },
      
    ];
    await User.create(users);
    
for (const artworkData of galleryData) {
  const artistName = artworkData.Artist;

  if (artistName) {
    const existingArtist = await User.findOne({ username: artistName, accountType: 'artist' });

    if (!existingArtist) {
      const artist = new User({
        username: artistName,
        password: '123', 
        accountType: 'artist',
      });

      await artist.save();
      console.log(`Artist account created for: ${artist.username}`);
    }
  } else {
    console.log('Skipping invalid artist data:', artworkData);
  }
}

    const artworks = [];

for (const artworkData of galleryData) {
  const artistName = artworkData.Artist;
  const existingArtist = await User.findOne({ username: artistName, accountType: 'artist' });

  if (!existingArtist) {
    const artist = new User({
      username: artistName,
      password: '123', 
      accountType: 'artist',
    });

    await artist.save();
    console.log(`Artist account created for: ${artist.username}`);
    
    try {
      const artwork = new Artwork({
        title: artworkData.Title,
        artist: artist._id,
        year: artworkData.Year,
        category: artworkData.Category,
        medium: artworkData.Medium,
        description: artworkData.Description,
        poster: artworkData.Poster,
      });

      await artwork.save();
      artworks.push(artwork);
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  } else {
    try {
      const artwork = new Artwork({
        title: artworkData.Title,
        artist: existingArtist._id,
        year: artworkData.Year,
        category: artworkData.Category,
        medium: artworkData.Medium,
        description: artworkData.Description,
        poster: artworkData.Poster,
      });

      await artwork.save();
      artworks.push(artwork);
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  }
}

console.log('Artworks:', artworks);

    
    console.log('Gallery data initialization complete.');

    
    const allUsers = await User.find();
    console.log('All Users:', allUsers);

    const allArtworks = await Artwork.find();
    console.log('All Artworks:', allArtworks);

    const allWorkshops = await Workshop.find();
    console.log('All Workshops:', allWorkshops);

  } catch (error) {
    console.error('Error initializing gallery data:', error);
  } finally {
    
    mongoose.disconnect();
  }
};


initializeGalleryData();

