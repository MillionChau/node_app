# Xây dựng ứng dụng web đơn giản bằng Node, ExpressJS và sử dụng MongoDB làm database
- ExpressJS là một trong những framework được sử dụng rất nhiều để xây dựng phần backend của các trang web 
- Với khả năng tích hợp thêm nhiều thư viện khác Express sẽ là một lựa chọn không tồi để xây dựng phần backend của trang web
## Mục tiêu
- Xây dựng được khung backend cơ bản kết nối với cơ sở dữ liệu được tạo bằng MongoDB và render ra giao diện web cơ bản
- Sử dụng mô hình MVC tạo ra phần backend của một trang web từ đó hiểu rõ hơn cách vận hành của mô hình này
- Xử lí cả 4 phương thức CRUD theo tiêu chuẩn của RESTful API 
- Render ra giao diện web cơ bản
## Cấu trúc thư mục
- Mã nguồn của dự án hầu hết được lưu trữ trong thư mục src của dự án
- Dự án có cấu trúc thư mục như sau:

node_app
- src
    - app
        - controller : Thư mục chứa các con troller của dự án
        - models : Thư mục chứa Schema để lấy data từ database
    - config
        - db : Gọi database với Mongoose
    - public
        - css : Chứa file css được convert từ scss
        - img : Chứa các hình ảnh được sử dụng
    - resource
        - scss : Chứa các file style SCSS
        - views : Chứa các file handlebars render ra giao diện dự án
            - layout : Chứa file gốc layout
            - partials : Chứa các thành phần luôn đi với trang web
            - ngoài ra trong thư mục này còn chứa các page riêng của web

        - routes : Chứa các routes liên kết các trang của dự án
        - util : Thư mục này chứa các file chuyển data trong database sang object để có thể render ra giao diện wb
    - file index.js chứa file gốc của dự án

## Các bước thực hiện
### Bước 1: Tạo thư mục dự án
- Tạo thư mục gốc chứa dự án
```bash
    mkdir node_app
    cd node_app
    code .
    npm init # Tạo file package.json
```
### Bước 2: Download các thư viện cần thiết
```bash
    npm install bootstrap express express-handlebars mongoose
    npm i husky lint-staged nodemon prettier morgan sass --save-dev
```
### Bước 3: Cấu hình `package.json`
```json
{
  "name": "node_app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "beautiful": "prettier --single-quote --trailing-comma all --write 'src/**/*.{js,json,scss}'",
    "start": "nodemon --inspect ./src/index.js",
    "watch": "sass  --embed-source-map --watch  ./src/resources/scss/app.scss ./src/public/css/app.css",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "husky": "^9.1.6",
    "lint-staged": "^15.2.10",
    "morgan": "^1.10.0",
    "nodemon": "^3.1.7",
    "prettier": "^3.3.3",
    "sass": "^1.80.6"
  },
  "dependencies": {
    "bootstrap": "^5.3.3",
    "express": "^4.21.1",
    "express-handlebars": "^8.0.1",
    "mongoose": "^8.8.0"
  }
}
```
### Bước 4: Tạo router
- Tạo file main chạy app `index.js` trong folder `src`
```js
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./config/db');

const app = express();
const port = 3000;

const route = require('./routes');
// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

// Phân tích dữ liệu từ các form HTML có Content-Type là application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  }),
);
// phân tích các yêu cầu HTTP có Content-Type là application/json
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
```
- Tạo các controller trong forder controller
+` NewsController.js`
```js
class NewsController {
  // [GET] / news
  index(req, res) {
    res.render('news');
  }
  // [GET] /: slug
  show(req, res) {
    res.send('NEW_DETAIL!!!');
  }
}

module.exports = new NewsController();
```
+ `SiteController.js`
```js
const Course = require('../models/Courses');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
  // [GET] /
  index(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render('home', {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }
  // [GET] / search
  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
```
- Xây dựng route tương ứng trong thư mục `routes`
+ `news.route.js`
```js
const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');

// Route động với phương thức GET
router.get('/:slug', newsController.show);

// Route tĩnh với phương thức GET cho trang gốc
router.get('/', newsController.index);

module.exports = router;
```
+ `site.controller.js`
```js
const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/', siteController.index);

module.exports = router;
```
- Tạo file `index.js` để exports các routes
```js
const newsRouter = require('./news.route');
const siteRouter = require('./site.route');

function route(app) {
  app.use('/news', newsRouter);
  app.get('/search', siteRouter);
  app.get('/', siteRouter);
}

module.exports = route;
```
### Bước 5: Thêm layout
- Tạo các file layout chính
+ `home.hbs`
```handlebars
<div class="mt-4">
    <div class="row d-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
        {{#each courses}}
        <div class="card card-course-item d-flex flex-column">
            <img src="{{this.image}}" class="card-img-top" alt="...">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{this.name}}</h5>
                <p class="card-text">{{this.description}}</p>
                <a href="#" class="btn btn-primary mt-auto">Buy courses</a>
            </div>
        </div>
        {{/each}}
    </div>
</div>
```
+ `search.hbs`
```handlebars
<div class="mt-4">
    <form method="POST" action="">
        <div class="mb-3">
            <label for="searchInput" class="form-label">Search</label>
            <input type="text" name="q" class="form-control" id="searchInput" placeholder="Enter your text...">
        </div>

        <div class="mb-3">
            <select name="gender" class="form-control" id="gender">
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Search</button>
    </form>
</div>
```
- Trong thư mục `partials`
+ `header.hbs`
```handlebars
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">My education</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/news">News</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/search">Search</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```
- Tạo file `main.hbs` trong thư mục `layouts`
```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My education</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/app.css">
</head>
<body>
    <div class="app">
        {{> header }}
        <div class="container">
            {{{body}}}
        </div>
        {{!-- {{> footer }} --}}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
    </script>
</body>
</html>
```
- Thêm SCSS trong thư mục `scss`
### Bước 6: Thêm CSDL
- Trong thư mục models tạo file` Courses.js` để tạo Schema
```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Course = new Schema({
  name: { type: String, maxLength: 255 },
  description: { type: String, maxLength: 600 },
  image: { type: String, maxLength: 255 },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', Course);
```
- Trong thư mục `config/db` tạo file `index.js` để connect với database
```js
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/my_education_dev');
    console.log('Connect Successfully!');
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
```
- Trong thư mục `util` tạo file `mongoose.js` để chuyển data từ database sang object
```js
module.exports = {
  multipleMongooseToObject: (mongooses) => {
    return mongooses.map((mongoose) => mongoose.toObject());
  },

  mongooseToObject: (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
```
### Bước 7: Thêm các phương thức CRUD
#### Read
- Thêm layout show vào file `show.hbs`
```hbs
<div class="mt-4">
    <div class="row">
        <div class="col-12 col-lg-3 mb-3 mb-lg-0">
            <button class="btn btn-primary w-100">Study Now</button>
            <ul class="list-unstyled">
                <li>{{course.level}}</li>
                <li></li>
                <li></li>
                <li>{{course.energy}}</li>
            </ul>
        </div>
        <div class="col-12 col-lg-9">
            <h2 class="h4">{{course.name}}</h2>
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube.com/embed/{{course.video}}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <p>{{course.description}}</p>
        </div>
    </div>
</div>
```

- Chỉnh sửa file `home.hbs` để render ra layout
```hbs
      {{#each courses}}
        <div class="card card-course-item d-flex flex-column">
            <a href="/courses/{{this.slug}}">
                <img src="{{this.image}}" class="card-img-top" alt="...">
            </a>
            <div class="card-body d-flex flex-column">
                <a href="/courses/{{this.slug}}">
                    <h5 class="card-title">{{this.name}}</h5>
                </a>
                <p class="card-text">{{this.description}}</p>
                <a href="#" class="btn btn-primary mt-auto">Buy courses</a>
            </div>
        </div>
      {{/each}}
```

- Thêm controlers trong file `CoursesController.js`
```js
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
  
module.exports = new CoursesController()

```

#### Create và POST lên database
- Thêm layout trong file `src/resource/views/courses/create.js`
```hbs
  <div class="mt-4">
    <h3>Add course</h3>
    <form method="POST" action="/courses/store">
        <div class="mb-3">
            <label for="name" class="form-label">Course name</label>
            <input type="name" class="form-control" id="name" name="name">
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Course description</label>
            <input type="text" class="form-control" id="description" name="description">
        </div>
        <div class="mb-3">
            <label for="video" class="form-label">Video ID</label>
            <input type="text" class="form-control" id="video" name="video">
        </div>
         <div class="mb-3">
            <label for="level" class="form-label">Level</label>
            <input type="text" class="form-control" id="level" name="level">
        </div>
        <div class="mb-3">
            <label for="energy" class="form-label">Place</label>
            <input type="text" class="form-control" id="energy" name="energy">
        </div>
        <button type="submit" class="btn btn-primary">Add Course</button>
    </form>
</div>
```
- Thêm controlers trong file `CoursesController.js`
```js
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
```

#### Update và PUT lên database
- Thêm giao diện quản lí
+ Thêm `course/user/store-courses.hbs` render ra giao diện quản lí
```hbs
<div class="container mt-4">
    <h2>Khoá học của tôi</h2>
    <div class="table-responsive mt-4">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Tên khoá học</th>
                    <th scope="col">Trình độ</th>
                    <th scope="col" colspan="3">Thời gian</th>
                </tr>
            </thead>
            <tbody>
                {{#each courses}}
                    <tr>
                        <th scope="row">{{sum @index 1}}</th>
                        <td>{{this.name}}</td>
                        <td>{{this.level}}</td>
                        <td>{{this.createdAt}}</td>
                        <td>
                            <a href="/courses/{{this._id}}/edit" class="btn btn-light">Update</a>
                        </td>
                        <td>
                            <a href="#" class="btn btn-light" data-id="{{this._id}}" data-bs-toggle="modal" data-bs-target="#deleteCourseModal">Delete</a>
                        </td>
                    </tr>
                {{/each}}
            </tbody>
        </table>
    </div>
</div>
```
+ Thêm controller vào file `UserController.js`
```js
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
  
```
- Thêm route và update `index.js` trong `routes`
```js
const express = require('express')
const router = express.Router()

const userControler = require('../app/controllers/UserControler')

router.get('/stored/courses', userControler.storedCourses)

module.exports = router

```

- Thêm form update trong file edit.hbs
```hbs
<div class="mt-4">
    <h3>Update courses</h3>
    <form method="POST" action="/courses/{{course._id}}?_method=PUT">
        <div class="mb-3">
            <label for="name" class="form-label">Course name</label>
            <input type="name" class="form-control" value="{{course.name}}" id="name" name="name">
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Course description</label>
            <textarea class="form-control" id="description" name="description">{{course.description}}</textarea>
        </div>
        <div class="mb-3">
            <label for="video" class="form-label">Video ID</label>
            <input type="text" class="form-control" value="{{course.video}}" id="video" name="video">
        </div>
         <div class="mb-3">
            <label for="level" class="form-label">Level</label>
            <input type="text" class="form-control" value="{{course.level}}" id="level" name="level">
        </div>
        <div class="mb-3">
            <label for="energy" class="form-label">Place</label>
            <input type="text" class="form-control" value="{{course.energy}}" id="energy" name="energy">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
    </form>
</div>
```

- Thêm controller cho CoursesController
```js
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
```
- Thêm route cho xử lí trên
```js
// router đi đến trang chỉnh sửa khoá học
router.get('/:id/edit',coursesController.edit)

// Router chỉnh sửa khoá học và lưu lại và database
router.put('/:id',coursesController.update)
```
#### Xử lí thao tác delete
- Thêm controller
```js
 async delete(req, res, next) {
    try {
      await Course.deleteOne({ _id: req.params.id });
      res.redirect('back')
    } catch(err) {
      next(err)
    }
  }
}
```
- Thêm route
```js
// Router xoá khoá học
router.delete('/:id',coursesController.delete)
```
- Cập nhật UI và xử lí thao tác `stores-courses`
```hbs
<!-- Confirm delete modal -->
<div class="modal fade" id="deleteCourseModal" tabindex="-1" aria-labelledby="deleteCourseModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteCourseModalLabel">Submit your change</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>The course will be deleted permanently and cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" id="confirmDeleteButton" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Undo</button>
      </div>
    </div>
  </div>
</div>
{{!-- Delete hidden form --}}
<form name="deleteForm" method="POST" action=""></form>

<script>
    const deleteCourseModal = document.getElementById('deleteCourseModal')
    if (deleteCourseModal) {
        let courseId
        let deleteForm = document.forms['deleteForm']
        deleteCourseModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            courseId = button.getAttribute('data-id')
        })

        const btnDeleteCourse = document.getElementById('confirmDeleteButton')
        btnDeleteCourse.onclick = () => {
            deleteForm.action = '/courses/' + courseId + '?_method=DELETE'
            deleteForm.submit()
        }
    }
</script>

```