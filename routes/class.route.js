const express = require('express');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const classModel = require('../models/class.model');
const validate = require('../middlewares/validate.mdw');
const classSchema = require('../schemas/class.json');
const membershipModel = require('../models/membership.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await classModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.findById(id);
  res.json(list);
})

router.get('/user/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.findByUserId(id);
  res.json(list);
})

router.get('/:id/members', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.membersOfClass(id);
  res.json(list);
})

router.get('/:id/teachers', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.teachersOfClass(id);
  res.json(list);
})

router.get('/:id/students', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.studentsOfClass(id);
  res.json(list);
})

router.post('/', validate(classSchema), async function (req, res) {
  classObj = req.body;
  classObj.code = crypto.randomBytes(4).toString("hex");
  const listIds = await classModel.add(classObj);

  // // check header contain beader
  // if (
  //   req.headers &&
  //   req.headers.authorization &&
  //   req.headers.authorization.split(" ")[0] === "Bearer"
  // ) {
  //   const token = req.headers.authorization.split(" ")[1];
  //   jwt.verify(token, primaryKey, function (err, decoded) {
  //     if (err) {
  //       res.sendStatus(401);
  //       return;
  //     } else {
  //       req.authorization = decoded;
  //     }
  //   });
  //   next();
  // } else {
  //   res.sendStatus(403);
  // }

  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const user = jwt.verify(token, 'SECRET_KEY',{
    ignoreExpiration: true
  });

  console.log(user);

  await membershipModel.add({
    id_user: user.id,
    id_class: listIds[0],
    role_member: 1
  });


  // await membershipModel.add({
  //   id_user: req.body.
  // })
  console.log(classObj);
  classObj.id = listIds[0];
  res.status(201).json(classObj);
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const classObj = req.body;
  const ret = await classModel.patch(id, classObj);

  return res.json(ret);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await classModel.del(id);

  return res.json(ret);
})

router.post('/:id/invite', async function (req, res) {
  const id = req.params.id || 0;
  const classcode = req.query.cjc || null;
  const role = req.query.role || 2;
  const classObj = await classModel.findById(id);

  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const user = jwt.verify(token, 'SECRET_KEY',{
    ignoreExpiration: true
  });

  if(user !== null && classObj.code === classcode){
    const membershipObj = await membershipModel.findByUserIdAndClassId(id,user.id);
    const memberObj = {
      id_class: id,
      id_user: user.id,
      role_member: role
    }

    if(membershipObj === null || membershipObj.role_member !== role){
      const listIds = await membershipModel.add(memberObj);
      memberObj.id = listIds[0];
      res.status(201).json(memberObj);
    }

    res.return(202);
    
  }else{
    res.status(400);
  }
})

module.exports = router;