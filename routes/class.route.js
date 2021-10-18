const express = require('express');

const classModel = require('../models/class.model');
const validate = require('../middlewares/validate.mdw');
const classSchema = require('../schemas/class.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await classModel.all();
  res.json(list);
})

router.post('/', validate(classSchema), async function (req, res) {
  const listIds = await classModel.add(req.body);
  classObj.id = listIds[0];
  res.status(201).json(classObj);
})

// router.patch('/:id', async function (req, res) {
//   const id = req.params.id || 0;
//   const ret = await classModel.patch(id, {
//     re
//   });

//   return res.json(ret);
// })

module.exports = router;