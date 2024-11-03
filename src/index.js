const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();
const port = 3000;

const route = require('./routes')

app.use(express.static(path.join(__dirname,'/public')))

// Phân tích dữ liệu từ các form HTML có Content-Type là application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}))
// phân tích các yêu cầu HTTP có Content-Type là application/json
app.use(express.json())

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './resources/views'));

// Route init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});