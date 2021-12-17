const express = require('express');

const membershipModel = require('../models/membership.model');
const userModel = require('../models/user.model');
const validate = require('../middlewares/validate.mdw');
const memberSchema = require('../schemas/membership.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await membershipModel.all();
  res.json(list);
})

router.get('/user/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await membershipModel.findByUserId(id);
  res.json(list);
})

router.get('/class/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await membershipModel.findByClassId(id);
  res.json(list);
})

router.get('/user/:id_user/class/:id_class', async function (req, res) {
  const id_user = req.params.id_user || 0;
  const id_class = req.params.id_class || 0;
  const list = await membershipModel.findByClassId(id_user,id_class);
  res.json(list);
})

router.post('/', validate(memberSchema), async function (req, res) {
  memberObj = req.body;
  const listIds = await membershipModel.add(req.body);
  memberObj.id = listIds[0];
  res.status(201).json(memberObj);
})

router.post('/class/:id_class/invite/:email/role/:role_member', async function (req, res) {
  memberObj = req.body;
  const id_class = req.params.id_class;
  const role_member = req.params.role_member;
  const email = req.params.email;
  const user = userModel.findByEmail(email);
  if(user !== null){
    const memberObj = {
      id_class: id_class,
      id_user: user.id,
      role_member: role_member
    }
    const listIds = await membershipModel.add(memberObj);
    memberObj.id = listIds[0];
    res.status(201).json(memberObj);
  }else{
    res.status(400);
  }
})

router.post('/class/:id_class/invite/:email/role/:role_member', async function (req, res) {
  memberObj = req.body;
  const id_class = req.params.id_class;
  const role_member = req.params.role_member;
  const email = req.params.email;
  const user = userModel.findByEmail(email);
  if(user !== null){
    const memberObj = {
      id_class: id_class,
      id_user: user.id,
      role_member: role_member
    }
    const listIds = await membershipModel.add(memberObj);
    memberObj.id = listIds[0];
    res.status(201).json(memberObj);
  }else{
    res.status(400);
  }
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const memberObj = req.body;
  const ret = await classModel.patch(id, memberObj);

  return res.json(ret);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await memberModel.del(id);

  return res.json(ret);
})

module.exports = router;