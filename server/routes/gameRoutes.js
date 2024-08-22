const express = require('express');
const router = express.Router();
const gamedbController = require('../controllers/gamedbController');

router.get('/', gamedbController.dbinfo);

//router.get('/loadData', gamedbController.loadData);
router.get('/search', gamedbController.SearchUser);
router.get('/searchforquery', gamedbController.SearchUserForQuery);
router.get('/iteminfo', gamedbController.ItemInfo);
router.get('/loginfo', gamedbController.LogInfo);


module.exports = router;