
const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.get('/:artistUsername', artistController.viewArtistProfile);

module.exports = router;
