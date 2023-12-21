const Artwork = require('../models/artwork');
const User = require('../models/user');

exports.getAddArtwork = (req, res) => {
  //console.log("ARTWORK");
  res.render('add-artwork-prompt');
};

exports.postAddArtwork = async (req, res) => {
  try {
    const { title, artist, year, category, medium, description, poster } = req.body;

    const existingArtwork = await Artwork.findOne({ title: req.body.title });
    if (existingArtwork) {
      return res.render('add-artwork-prompt', { error: 'Artwork with this title already exists.' });
    }

    const newArtwork = new Artwork({
      title: req.body.title,
      artist: req.session.userId,
      year: req.body.year,
      category: req.body.category,
      medium: req.body.medium,
      description: req.body.description,
      poster: req.body.poster,
    });

    await newArtwork.save();
    const artistUser = await User.findById(req.session.userId);
    //console.log("USER", artistUser.username);
    
    for (const followerId of artistUser.followers) {
      //console.log("IN THE LOOP");
      const follower = await User.findById(followerId);
      if (follower) {
        follower.notifications.push({
          type: 'newArtist',
          content: `${artistUser.username} added a new artist: ${title}.`,
        });
        await follower.save();
      }
    }

    

    res.redirect('/user/account');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork
      .findById(req.params.artworkId)
      .populate('likes reviews.user');

    const currentUser = await User.findById(req.session.userId);

    res.render('artwork', { artwork, currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addReview = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);
    const user = await User.findById(req.session.userId);

    if (artwork && user) {
      artwork.reviews.push({ user: user._id, text: req.body.review });
      await artwork.save();
      user.reviews.push({ artwork: artwork._id, text: req.body.review });
      await user.save();
    }

    res.redirect(`/artwork/${req.params.artworkId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addLike = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);
    const user = await User.findById(req.session.userId);

    if (artwork && user) {
      artwork.likes.push(user._id);
      await artwork.save();
      user.likedArtworks.push(artwork._id);
      await user.save();
    }

    res.redirect(`/artwork/${req.params.artworkId}`);
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

