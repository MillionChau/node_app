const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');

// Route động với phương thức GET
router.get('/:slug', newsController.show);

// Route tĩnh với phương thức GET cho trang gốc
router.get('/', newsController.index);

module.exports = router;
