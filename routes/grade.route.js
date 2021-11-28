const express = require('express');

const gradeModel = require('../models/grade.model');
const validate = require('../middlewares/validate.mdw');
const gradeSchema = require('../schemas/grade.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await gradeModel.all();
  res.json(list);
})

router.get('/class/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await gradeModel.findByClassId(id);
  res.json(list);
})

router.post('/', validate(gradeSchema), async function (req, res) {
  gradeObj = req.body;
  const listIds = await gradeModel.add(req.body);
  gradeObj.id = listIds[0];
  res.status(201).json(gradeObj);
})

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const gradeObj = req.body;
  const ret = await gradeModel.patch(id, classObj);

  return res.json(ret);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await gradeModel.del(id);

  return res.json(ret);
})

module.exports = router;