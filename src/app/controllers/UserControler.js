const Course = require('../models/Courses')
const {multipleMongooseToObject} = require('../../util/mongoose')

class UserController {
    // [GET] / me/stored/courses
    storedCourses(req, res, next) {
        Course.find({})
            .then(courses => res.render('user/stored-courses',{
                courses: multipleMongooseToObject(courses)
            }))
            .catch(next)
    }
  }
  
  module.exports = new UserController();
  