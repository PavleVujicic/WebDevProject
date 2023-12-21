const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');

router.get('/add', workshopController.getAddWorkshop);
router.post('/add', workshopController.postAddWorkshop);
router.get('/:workshopId', workshopController.viewWorkshopDetails);
router.post('/:workshopId/enroll', workshopController.enrollWorkshop);

module.exports = router;

