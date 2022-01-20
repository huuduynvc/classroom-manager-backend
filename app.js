if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
require('express-async-errors');
const session = require('express-session');
const methodOverride = require('method-override');

const auth = require('./middlewares/auth.mdw');

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const initializePassport = require('./utils/passport')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
const users = [];

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false })); 

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.json({ message: 'Welcome to Classroom manager api' });   
});
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
// app.use('/api/class', auth, require('./routes/class.route'));
app.use('/api/class',require('./routes/class.route'));
app.use('/api/grade', require('./routes/grade.route'));
app.use('/api/point', require('./routes/gradeboard.route'));
app.use('/api/membership', require('./routes/membership.route'));
app.use('/api/admin', require('./routes/admin.route'));


app.use(function (req, res, next) {
  res.status(404).send({
    error_message: 'Endpoint not found!'
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    error_message: 'Something broke!'
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/signin')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

const PORT = process.env.PORT || 3030;
app.listen(PORT, function () {
  console.log(`Classroom manager api is running at http://localhost:${PORT}`);
});