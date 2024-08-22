const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 사용자 목록 조회
router.get('/', userController.getUsers);

// 사용자 추가
router.post('/add', userController.createUser);

module.exports = router;
