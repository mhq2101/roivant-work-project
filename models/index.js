var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/roivant-work-project');
var h2p = require('html2plaintext')
var bcrypt = require('bcrypt-nodejs');

var User = db.define('user', {
  email: {
      type: Sequelize.STRING
  },
  password: {
      type: Sequelize.STRING
  },
});


User.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

var News = db.define('news', {
  title: {
      type: Sequelize.STRING
  },
  content: {
      type: Sequelize.TEXT
  },
  date: {
    type: Sequelize.DATE
  }
}, {
  getterMethods: {
    text() {
      return h2p(this.content)
    }
  },
});

var Webpage = db.define('webpage', {
  title: {
      type: Sequelize.STRING
  },
  content: {
      type: Sequelize.TEXT
  },
  url: {
    type: Sequelize.STRING
  }
}, {
  getterMethods: {
    text() {
      return h2p(this.content)
    }
  },
});


module.exports = {
  db,
  News,
  Webpage,
  User
};
