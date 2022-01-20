const express = require('express');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');
const fs = require("fs");
var XLSX = require('xlsx')

const classModel = require('../models/class.model');
const gradeModel = require('../models/grade.model');
const gradeboardModel = require('../models/gradeboard.model');
const validate = require('../middlewares/validate.mdw');
const classSchema = require('../schemas/class.json');
const membershipModel = require('../models/membership.model');
const userModel = require('../models/user.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await classModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const list = await classModel.findById(id);

  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const user = jwt.verify(token, 'SECRET_KEY',{
    ignoreExpiration: true
  });

  console.log(user);
  const memb = await membershipModel.findByUserId(user.id);
  console.log(memb);
  if(memb !== null){
    list.role_member = memb[0].role_member;
  }
    
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

router.get('/invite/bylink', async function (req, res) {
  console.log(req.query.clc);
  const classcode = req.query.cjc || null;
  const role = req.query.role || 2;
  const classObj = await classModel.findByCode(classcode);
  console.log(classObj);

  console.log(req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const user = jwt.verify(token, 'SECRET_KEY',{
    ignoreExpiration: true
  });

  if(user !== null && classObj !== null && classObj.code === classcode){
    const membershipObj = await membershipModel.findByUserIdAndClassId(user.id,classObj.id);
    console.log(membershipObj);
    const memberObj = {
      id_class: classObj.id,
      id_user: user.id,
      role_member: role
    }

    if(membershipObj.length === 0){
      console.log('1xxxx');
      const listIds = await membershipModel.add(memberObj);
      memberObj.id = listIds[0];
      res.status(201).json(memberObj);
    }
    res.status(202);
  }
  res.status(400);
})

router.post('/:id/upload', async(req, res) => {
    const id = req.params.id || 0;
    // console.log(req.body);
    // var workbook = XLSX.readFile(req.body.input_file);
    // var sheet_name_list = workbook.SheetNames;
    // var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    // console.log(xlData);
    var filename;

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `./public/templates`);
        },
        filename: function(req, file, cb) {
            cb(null, id.toString() + path.extname(file.originalname))
            filename = id.toString() + path.extname(file.originalname);
        }
    });

    const upload = multer({ storage });
    upload.single('input_file')(req, res, async function(err) {
      console.log(req);
      console.log(req.file);

      try{var workbook = XLSX.readFile(req.file.path);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        //console.log(xlData);
  
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  
        for(let i=0;i<xlData.length;i++){
          const user = await userModel.findByStudentId(xlData[i].studentid);
          if(user !== null){
            console.log(user.id);
            const memberObj = await membershipModel.findByUserIdAndClassId(user.id,id);
  
            if(memberObj.length === 0){
              await membershipModel.add({
                id_user: user.id,
                id_class: id,
                role_member: 2,
                creation_time: new Date(datetime),
                modification_time: new Date(datetime),
              });
            }
          }
        }
  
          

      }catch(err){
        console.log(err);
      }
        

        // await classModel.patch(id,{
        //     creation_time: new Date(datetime),
        //     modification_time: new Date(datetime),
        //     template: filename,
        // });

        if (err) {
          console.log(err);
          res.status(401).json(err);
        }else{
          res.status(200).json("Upload file successfully.");
        }
    });
})

router.post('/:id/upload_grade_v2', async(req, res) => {
  const id = req.params.id || 0;

  var filename;

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
          cb(null, `./public/templates`);
      },
      filename: function(req, file, cb) {
          cb(null, id.toString() + path.extname(file.originalname))
          filename = id.toString() + path.extname(file.originalname);
      }
  });

  const upload = multer({ storage });
  upload.single('input_file')(req, res, async function(err) {
    console.log(req);
    console.log(req.file);

    try{var workbook = XLSX.readFile(req.file.path);
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      //console.log(xlData);

      var currentdate = new Date();
      var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

      console.log(Object.keys(xlData[0])[2]);
      const id_grade = await gradeModel.add({
        id_class: id,
        name: Object.keys(xlData[0])[2],
        point: 1
      })

      for(let i=0;i<xlData.length;i++){
        const user = await userModel.findByStudentId(xlData[i].studentid);

        if(user !== null){
          await gradeboardModel.add({
            id_user: user.id,
            id_grade: id_grade,
            gpoint: xlData[i][Object.keys(xlData[0])[2]]
          })
        }
      }
        

    }catch(err){
      console.log(err);
    }
      

      // await classModel.patch(id,{
      //     creation_time: new Date(datetime),
      //     modification_time: new Date(datetime),
      //     template: filename,
      // });

      if (err) {
        console.log(err);
        res.status(401).json(err);
      }else{
        res.status(200).json("Upload file successfully.");
      }
  });
})

router.post('/:id/upload_grade', async(req, res) => {
  const id = req.params.id || 0;

  var filename;

  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
          cb(null, `./public/templates`);
      },
      filename: function(req, file, cb) {
          cb(null, id.toString() + path.extname(file.originalname))
          filename = id.toString() + path.extname(file.originalname);
      }
  });

  const upload = multer({ storage });
  upload.single('input_file')(req, res, async function(err) {

      try{var workbook = XLSX.readFile(req.file.path);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        //console.log(xlData);

        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        let grade_names = Object.keys(xlData[0]);
        console.log(grade_names);
        grade_names = grade_names.slice(2);
        console.log(grade_names);
        let grade_ids = [];

        grade_names.forEach(async element => {
          const id_grade = await gradeModel.add({
            id_class: id,
            name: element,
            point: 1
          })

          grade_ids.push(id_grade);
        });

        for(let i=0;i<xlData.length;i++){
          const user = await userModel.findByStudentId(xlData[i].studentid);
          const usergrade = await gradeboardModel.findByUserId(user.id);
          console.log(user);
          console.log(usergrade);

          if(user !== null){
            for (let index = 0; index < grade_names.length; index++) {
              const element = grade_names[index];
              await gradeboardModel.add({
                id_user: user.id,
                id_grade: grade_ids[index],
                gpoint: xlData[i][element]
              })
              
            }
          }
        }
          

      }catch(err){
        console.log(err);
      }
      // if (err) {
      //   res.status(401).json(err);
      // }else{
        res.status(200).json("Upload file successfully.");
      //}
  });
})




module.exports = router;