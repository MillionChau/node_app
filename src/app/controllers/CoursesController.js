const Course = require('../models/Courses')
const {mongooseToObject} = require('../../util/mongoose')

class CoursesController {
  // [GET] / slug
  show(req, res, next) {
    Course.findOne({slug: req.params.slug})
        .then(course => {
            res.render('courses/show', {course: mongooseToObject(course)})
        })
        .catch(next)
  }
  //[GET] / courses / create
  create(req, res, next) {
    res.render('courses/create')
  }

  //[POST] / courses / store
  async store(req, res, next) {
    try {
      const formData = req.body
      // Convert url youtube thành url image
      formData.image = `https://img.youtube.com/vi/${req.body.video}/mqdefault.jpg`
      await Course.create(formData)
      res.redirect('/')
    } catch (error) {
      next(error)
    }
  }
  // [GET] / courses / :id /edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then(course => res.render('courses/edit', {
        course: mongooseToObject(course)
      }))
      .catch(next)
  }

  // [PUT] / courses / :id 
  async update(req, res, next) {
    try {
      await Course.updateOne({ _id: req.params.id }, req.body);
      res.redirect('/user/stored/courses')
    } catch(err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      await Course.deleteOne({ _id: req.params.id });
      res.redirect('back')
    } catch(err) {
      next(err)
    }
  }
}

module.exports = new CoursesController()
