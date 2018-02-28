const express = require('express');
const app = express();
// const routes = require('./routes');
// const models = require('./models')
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const volleyball = require('volleyball');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mikhailqader16@gmail.com',
    pass: 'Shnell1319+'
  }
});



module.exports = app;

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { noCache: true });

//middleware
app.use(volleyball);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(1337, () => {
  console.log('yo server be listenin on 1337');
});
app.get('/', function (req, res, next) {
  res.render('index2')
})
app.get('/contact', function (req, res, next) {
  res.render('contact')
})
app.get('/macular-edema', function (req, res, next) {
  res.render('macular-edema')
})
app.get('/darapladib', function (req, res, next) {
  res.render('darapladib')
})

app.post('/email', function (req, res, next) {
  var mailOptions = {
    from: 'mikhailqader16@gmail.com',
    to: 'mhq2101@columbia.edu',
    subject: 'concerning ' + req.body.subject + ' from ' + req.body.name,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.redirect('/')
})