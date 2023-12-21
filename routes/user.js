const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/remove-review/:reviewId', userController.removeReview);
router.post('/remove-like/:artworkId', userController.removeLike);

router.use(authMiddleware);

router.get('/account', userController.getAccountInfo);
router.get('/switch-account', userController.switchAccount);
router.get('/following', userController.getFollowedArtists);
router.post('/follow/:artistId', userController.sendFollowArtist);
router.post('/unfollow/:artistId', userController.unfollowArtist);
router.post('/review/:artworkId', userController.writeReview);
router.post('/like/:artworkId', userController.addLike);
router.get('/notifications', userController.getNotifications);
router.get('/search', userController.searchArtworks);
router.post('/clear-notifications', authMiddleware, userController.clearNotifications);

module.exports = router;
