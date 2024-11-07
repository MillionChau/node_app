const newsRouter = require('./news.route')
const siteRouter = require('./site.route')
const coursesRouter = require('./courses.route')
const userRouter = require('./user.route')

function route(app) {
  app.use('/news', newsRouter)
  app.get('/search', siteRouter)
  app.use('/courses', coursesRouter)
  app.use('/user',userRouter)
  app.get('/', siteRouter)
}

module.exports = route
