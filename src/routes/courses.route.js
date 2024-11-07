const express = require('express')
const router = express.Router()

const coursesController = require('../app/controllers/CoursesController')

// Router tạo khoá học
router.get('/create', coursesController.create)

// Router thêm khoá học vào database
router.post('/store', coursesController.store)

// router đi đến trang chỉnh sửa khoá học
router.get('/:id/edit',coursesController.edit)

// Router chỉnh sửa khoá học và lưu lại và database
router.put('/:id',coursesController.update)

// Router xoá khoá học
router.delete('/:id',coursesController.delete)

// Router đi đến khoá học bất kì với slug
router.get('/:slug', coursesController.show)

module.exports = router
