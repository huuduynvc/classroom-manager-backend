const express = require('express');

const classModel = require('../models/class.model');
const validate = require('../middlewares/validate.mdw');
const classSchema = require('../schemas/class.json');

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
  const list = await classModel.allMembersOfClass(id);
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
  const listIds = await classModel.add(req.body);
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

module.exports = router;