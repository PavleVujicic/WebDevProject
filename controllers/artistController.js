
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Workshop = require('../models/workshop');

exports.viewArtistProfile = async (req, res) => {
  try {
    
    const artist = await User.findOne({
        _id: req.params.artistUsername,
      accountType: 'artist',
    });

    if (!artist) {
      
      return res.status(404).send('Artist not found');
    }

    const artworks = await Artwork.find({ artist: artist._id });

    const workshops = await Workshop.find({ host: artist._id });

    res.render('artist-profile', { artist, artworks, workshops });
  } catch (error) {
    console.error('Error Artist Profile', error);
    res.status(500).send('Internal Server Error');
  }
};

