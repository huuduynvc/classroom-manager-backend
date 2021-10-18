const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');

const router = express.Router();

router.post('/', validate(userSchema), async function (req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.id = await userModel.add(user);
  delete user.password;
  res.status(201).json(user);
})

module.exports = router;