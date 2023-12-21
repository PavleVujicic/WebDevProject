const User = require('../models/user');
const Artwork = require('../models/artwork');
const Workshop = require('../models/workshop');

exports.getAccountInfo = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const artworks = await Artwork.find({ artist: user._id });
    const workshops = await Workshop.find({ host: user._id });
    res.render('account', { currentUser: user, artworks, workshops });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.switchAccount = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (user.accountType === 'patron') {
      const artworks = await Artwork.find({ artist: user._id });
      if (artworks.length === 0) {
        return res.render('add-artwork-prompt');
      }
    }

    user.accountType = user.accountType === 'patron' ? 'artist' : 'patron';
    await user.save();

    res.redirect('/user/account');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getFollowedArtists = async (req, res) => {
  try {

    const user = await User.findById(req.session.userId).populate('followedArtists');
    res.render('following', { followedArtists: user.followedArtists });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.sendFollowArtist = async (req, res) => {
  try {
    //console.log("FOLLOWED ARTIST");
    const user = await User.findById(req.session.userId);
    const artistId = req.params.artistId;
    
    if (!user.followedArtists.includes(artistId)) {
      user.followedArtists.push(artistId);
      await user.save();

      const artist = await User.findById(artistId);
      if (artist) {
        
        artist.followers.push(user._id);
        artist.notifications.push({
          type: 'newFollower',
          content: `${user.username} is now following you.`,
        });
        await artist.save();
      }
    }

    res.redirect('/user/following');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.unfollowArtist = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const artistId = req.params.artistId;

    const index = user.followedArtists.indexOf(artistId);
    if (index !== -1) {
      user.followedArtists.splice(index, 1);
      await user.save();

      const artist = await User.findById(artistId);
      if (artist) {
        const followerIndex = artist.followers.indexOf(user._id);
        if (followerIndex !== -1) {
          artist.followers.splice(followerIndex, 1);
          await artist.save();
        }
      }
    }

    res.redirect('/user/following');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



exports.writeReview = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const artwork = await Artwork.findById(req.params.artworkId);
    const reviewText = req.body.review;

    if (user && artwork && reviewText) {
      artwork.reviews.push({ user: user._id, text: reviewText });
      await artwork.save();
    }

    res.redirect('/artwork/${req.params.artworkId}');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addLike = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const artwork = await Artwork.findById(req.params.artworkId);

    if (user && artwork) {
      artwork.likes.push(user._id);
      await artwork.save();
    }

    res.redirect('/artwork/${req.params.artworkId}');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('notifications', { notifications: user.notifications });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, { $set: { notifications: [] } });
    res.redirect('/user/notifications');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.searchArtworks = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query; 
    const artistUser = await User.findOne({ username: query, accountType: 'artist' });
    
    const regexQuery = new RegExp(query, 'i');

    const mongoDBQuery = {
      $or: [
        { title: { $regex: regexQuery } },
        { artist: artistUser ? artistUser._id : null },
        { category: { $regex: regexQuery } },
      ],
    };

    const searchResults = await Artwork.find(mongoDBQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Artwork.countDocuments(mongoDBQuery);

    const totalPages = Math.ceil(totalCount / limit);

    res.render('search', {
      results: searchResults,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getArtistProfile = async (req, res) => {
  try {
    const artist = await User.findById(req.params.artistId);
    const artworks = await Artwork.find({ artist: artist._id });
    const workshops = await Workshop.find({ host: artist._id });

    const currentUser = await User.findById(req.session.userId);

    res.render('artist-profile', { artist, artworks, workshops, currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.enrollInWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId);
    const user = await User.findById(req.session.userId);

    if (workshop && user) {
      workshop.enrolledUsers.push(user._id);
      await workshop.save();

      res.redirect('/user/artist/${workshop.host}');
    } else {
      res.status(404).send('Workshop or user not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.followArtist = async (req, res) => {
  try {
    const artist = await User.findById(req.params.artistId);
    const user = await User.findById(req.session.userId);

    if (artist && user) {
      user.followedArtists = user.followedArtists || [];
      
      if (!user.followedArtists.includes(artist._id)) {
        user.followedArtists.push(artist._id);
        await user.save();

      }
    }

    res.redirect(`/artists/${req.params.artistId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.removeReview = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);
    const user = await User.findById(req.session.userId);

    if (artwork && user) {
      const reviewIndex = artwork.reviews.findIndex(review => review.user.equals(user._id));
      if (reviewIndex !== -1) {
        artwork.reviews.splice(reviewIndex, 1);
        await artwork.save();

        const userReviewIndex = user.reviews.findIndex(review => review.artwork.equals(artwork._id));
        if (userReviewIndex !== -1) {
          user.reviews.splice(userReviewIndex, 1);
          await user.save();
        }
      }
    }

    res.redirect(`/artwork/${req.params.artworkId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.removeLike = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);
    const user = await User.findById(req.session.userId);

    if (artwork && user) {
      const likeIndex = artwork.likes.findIndex(like => like.equals(user._id));
      if (likeIndex !== -1) {
        artwork.likes.splice(likeIndex, 1);
        await artwork.save();

        const userLikeIndex = user.likedArtworks.findIndex(likedArtwork => likedArtwork.equals(artwork._id));
        if (userLikeIndex !== -1) {
          user.likedArtworks.splice(userLikeIndex, 1);
          await user.save();
        }
      }
    }

    res.redirect(`/artwork/${req.params.artworkId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};