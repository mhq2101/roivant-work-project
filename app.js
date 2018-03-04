const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// const routes = require('./routes');
const models = require('./models')
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const volleyball = require('volleyball');
const nodemailer = require('nodemailer');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

require('./config/passport')(passport); // pass passport for configuration




module.exports = app;

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { noCache: true });

//middleware
app.use(volleyball);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static('public'));


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mikhailqader16@gmail.com',
    pass: 'Shnell1319+'
  }
});

// required for passport
app.use(session({ secret: 'iloveroivant' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes
app.get('/', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  res.render('index2', sendObj)
})
app.get('/contact', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  res.render('contact', sendObj)
})
app.get('/macular-edema', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  res.render('macular-edema', sendObj)
})
app.get('/darapladib', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  res.render('darapladib', sendObj)
})
app.get('/partners', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  res.render('partners', sendObj)
})
app.get('/chat', function (req, res) {
  var sendObj = {}
  if (req.user) {
    console.log(req.user)
    sendObj.user = req.user
  }
  res.render('chat', sendObj)
})
app.get('/test', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  var allNewsPromise = models.News.findAll({
    order: [['createdAt', 'DESC']]
  })
  var latestPromise = models.News.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']]
  })
  Promise.all([allNewsPromise, latestPromise])
    .then(result => {
      var allNews = result[0];
      var latest = result[1][0];
      sendObj.allNews = allNews;
      sendObj.article = latest;
      res.render('test', sendObj)
    })
})
app.get('/test/:id', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  var articlePromise = models.News.findById(req.params.id)
  var allNewsPromise = models.News.findAll({
    order: [['createdAt', 'DESC']]
  })
  Promise.all([allNewsPromise, articlePromise])
    .then(result => {
      var allNews = result[0];
      var article = result[1];
      sendObj.allNews = allNews;
      sendObj.article = article;
      res.render('test', sendObj)
    })

})
app.get('/search', function (req, res) {
  var sendObj = {}
  if (req.user) {
    sendObj.user = req.user
  }
  var newsResultPromise = models.News.findAll({
    where: {
      $or: [
        {
          content: {
            $ilike: "%" + req.query.search + "%"
          }
        },
        {
          title: {
            $ilike: "%" + req.query.search + "%"
          }
        },
      ],
    }
  })
  var siteResultPromise = models.Webpage.findAll({
    where: {
      content: {
        $ilike: "%" + req.query.search + "%"
      }
    }
  })
  var allNewsPromise = models.News.findAll({
    order: [['createdAt', 'DESC']]
  })
  Promise.all([allNewsPromise, newsResultPromise, siteResultPromise])
    .then(result => {
      var allNews = result[0];
      var results = result[1];
      var siteResults = result[2]
      sendObj.allNews = allNews;
      sendObj.results = results;
      sendObj.siteResults = siteResults;
      res.render('search', sendObj)
    })
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
  res.redirect('/contact')
})

app.get('/login', function (req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', { message: req.flash('loginMessage') });
});
// process the login form
app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

app.get('/signup', function (req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup', { message: req.flash('signupMessage') });
});
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));
app.get('/profile', isLoggedIn, function (req, res) {
  console.log(req.user)
  res.render('profile', {
    user: req.user // get the user out of session and pass to template
  });
});
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

//sync models, start the server, establish two-way persistent connection with socket.io
models.db.sync()
  .then(() => {
    http.listen(1337, () => {
      console.log('yo server be listenin on 1337');
    });
  })

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  //socket message listener
  socket.on("message", function (message) {
    console.log(message)
    socket.broadcast.emit('message', message)
  })


});