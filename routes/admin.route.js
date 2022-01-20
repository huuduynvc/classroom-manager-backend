const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const adminModel = require('../models/admin.model');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');
const { del } = require('../models/gradeboard.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await adminModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const admin = await adminModel.single(id);
  const user = await userModel.single(admin.userid);
  delete user.password;
  delete user.rfToken;
  res.json(user);
})

router.post('/', async function (req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  const userid = await userModel.add(user);
  console.log(user);
  const admin = {
    userid : userid,
  }
  admin.id = await adminModel.add(admin);
  res.status(201).json(admin);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await userModel.del(id);

  return res.json(ret);
})

module.exports = router;