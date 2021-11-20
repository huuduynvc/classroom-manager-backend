const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await userModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const user = await userModel.single(id);
  res.json(user);
})

router.post('/', validate(userSchema), async function (req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.id = await userModel.add(user);
  delete user.password;
  res.status(201).json(user);
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const userObj = req.body;
  const ret = await userModel.patch(id, userObj);

  return res.json(ret);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await userModel.del(id);

  return res.json(ret);
})

module.exports = router;