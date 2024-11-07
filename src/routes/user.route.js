const express = require('express')
const router = express.Router()

const userControler = require('../app/controllers/UserControler')

router.get('/stored/courses', userControler.storedCourses)

module.exports = router
