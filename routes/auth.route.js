const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');

const userModel = require('../models/user.model');
const adminModel = require('../models/admin.model');
const validate = require('../middlewares/validate.mdw');

const userSchema = require('../schemas/user.json');
const rfTokenSchema = require('../schemas/rfToken.json');

const router = express.Router();

router.post('/', validate(userSchema), async function (req, res) {
  const user = await userModel.findByUserName(req.body.username);
  if (user === null) {
    return res.json({
      authenticated: false
    });
  }

  // const email = await userModel.findByEmail(req.body.email);
  // if (email === null) {
  //   return res.json({
  //     authenticated: false
  //   });
  // }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false
    });
  }

  let role_user = 0;
  if(await adminModel.findByUserId(user.id) !== null){
    role_user = 1;
  }
  
  const accessToken = jwt.sign({
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
    creation_time: user.creation_time,
    expired_time: 10*60,
    studentid: user.studentid,
    role_user: role_user
  }, 'SECRET_KEY', {
    expiresIn: 10 * 60 // seconds
  });


  const refreshToken = randomstring.generate();
  await userModel.updateRefreshToken(user.id, refreshToken);

  res.json({
    authenticated: true,
    accessToken,
    refreshToken
  })
})

router.post('/refresh', validate(rfTokenSchema), async function (req, res) {
  // req.body = {
  //   accessToken,
  //   refreshToken
  // }

  const { accessToken, refreshToken } = req.body;
  const { userId } = jwt.verify(accessToken, 'SECRET_KEY', {
    ignoreExpiration: true
  });

  const ret = await userModel.isValidRefreshToken(userId, refreshToken);
  if (ret === true) {
    const newAccessToken = jwt.sign({ userId }, 'SECRET_KEY', { expiresIn: 60 * 10 });
    return res.json({
      accessToken: newAccessToken
    })
  }

  res.status(400).json({
    message: 'Invalid refresh token.'
  })
})

module.exports = router;