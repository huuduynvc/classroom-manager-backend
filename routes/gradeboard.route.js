const express = require('express');
const moment = require('moment');

const gradeboardModel = require('../models/gradeboard.model');
const membershipModel = require('../models/membership.model');
const validate = require('../middlewares/validate.mdw');
const gradeSchema = require('../schemas/gradeboard.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await gradeboardModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id_class = req.params.id || 0;
  const membership = await membershipModel.findByClassId(id_class);

  var listObj = [];

  for(let i = 0;i<membership.length;i++){
    let gradesObj = [];
    let pointsObj = [];
    const points = await gradeboardModel.findByClassIdAndUserId(id_class,membership[i].id_user);
    console.log(points);

    if(points.length > 0){
      points.map(e => {
        gradesObj.push(e.name);
        pointsObj.push(e.gpoint);
      });
  
      listObj.push({
        fullname: points[0].fullname,
        studentid: points[0].studentid,
        grades: gradesObj,
        points: pointsObj,
      });
    }

  }
  console.log(listObj);
  res.json(listObj);
})

// router.get('/class/:id', async function (req, res) {
//   const id = req.params.id || 0;
//   const list = await gradeModel.findByClassId(id);
//   list.forEach(element => {
//     element.deadline = moment(element.deadline).format('YYYY-MM-DD HH:mm:ss');
    
//   });
//   res.json(list);
// })

// router.post('/', validate(gradeSchema), async function (req, res) {
//   gradeObj = req.body;
//   const listIds = await gradeModel.add(req.body);
//   gradeObj.id = listIds[0];
//   res.status(201).json(gradeObj);
// })

// router.patch('/:id', async function (req, res) {
//   const id = req.params.id || 0;
//   const gradeObj = req.body;
//   const ret = await gradeModel.patch(id, gradeObj);

//   return res.json(ret);
// })

// router.post('/class/:id', async function (req, res) {
//   const id_class = req.params.id || 0;
//   const {assignments} = req.body;

//   const old_assignments = await gradeModel.findByClassId(id_class);
//   for (const element of old_assignments){
//     await gradeModel.del(element.id);
//   }

//   console.log(assignments);

//   let i = 1;
//   for (let element of assignments) {
//     element.deadline = moment(element.deadline).format('YYYY-MM-DD HH:mm:ss');
//     element.id_class = id_class;
//     delete element.id;
//     element.stt = i++;
//     await gradeModel.add(element);
//   }
//   res.status(204).json(true);
// })

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await gradeboardModel.del(id);

  return res.json(ret);
})

module.exports = router;