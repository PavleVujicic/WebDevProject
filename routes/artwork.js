const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const authMiddleware = require('../middleware/auth');
router.get('/add', artworkController.getAddArtwork);
router.post('/add', artworkController.postAddArtwork);
router.get('/:artworkId', artworkController.getArtwork);
router.post('/:artworkId/review', authMiddleware, artworkController.addReview);
router.post('/:artworkId/like', authMiddleware, artworkController.addLike);
router.post('/:artworkId/remove-review', authMiddleware, artworkController.removeReview);

module.exports = router;



