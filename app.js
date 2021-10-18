const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');

const auth = require('./middlewares/auth.mdw');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/class', auth, require('./routes/class.route'));

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

const PORT = process.env.PORT || 3030;
app.listen(PORT, function () {
  console.log(`Classroom manager api is running at http://localhost:${PORT}`);
});