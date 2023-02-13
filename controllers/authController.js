const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const tokenModel = require('../models/tokenModel');
const loginModel = require('../models/loginHistoryModel');
const jwt = require('jsonwebtoken');
require('dotenv');

// user login
module.exports.login = (req, res, next) => {
  let user=req.body.email;
  if(user==undefined){
    user=req.body.phoneNumber;
    Model.find({ phoneNumber: user })
    .exec()
    .then((user) => {
      //bcrypt password
      if (user.length < 1) {
        return res.status(401).json({
          msg: 'user no exit',
        });
      }
      if(user[0].isPhoneVerified===false &&user[0].isEmailVerified===false) 
      {return res.status(401).json({
        msg: 'Phone Number & Emailid is not verified',
      });
    }
      bcrypt.compare(
        req.body.password,
        user[0].password,
        async (err, result) => {
          if (!result) {
            return res.status(401).json({
              msg: 'password matching failed',
            });
          }
          // genrate token
          if (result) {
            const token = jwt.sign(
              {
                _id: user[0]._id,
                email: user[0].email,
                name: user[0].name,
                userType: user[0].userType,
              },
              process.env.SECRET_KEY,
              //expire time
              {
                expiresIn: '24h',
              }
            );
            tokenModel.findOne(
              { phoneNumber: req.body.phoneNumber },
              function (err, user1) {
                if (err) return handleErr(err);
                if (user1 == null) {
                  const data = new tokenModel({
                    userID: user[0]._id,
                    token: token,
                    email: user[0].email,
                  });
                  data.save();
                } else {
                  user1.token = token;
                  user1.save(function (err) {
                    if (err) return handleErr(err);
                    //user has been updated
                  });
                }
              }
            );
            //final response
            const logData = new loginModel({
              userID: user[0]._id,
              userName: user[0].name,
            });
            try {
              await logData.save();
            } catch (error) {
              console.log(error);
            }

            res.status(200).json({
              _id: user[0]._id,
              userType: user[0].userType,
              email: user[0].email,
              name: user[0].name,
              token: token,
            });
          }
        }
      );
    });
  }
  else{
  Model.find({ email: req.body.email })
    .exec()
    .then((user) => {
      //bcrypt password
      if (user.length < 1) {
        return res.status(401).json({
          msg: 'user no exit',
        });
      }
      if(user[0].isPhoneVerified===false &&user[0].isEmailVerified===false) 
      {return res.status(401).json({
        msg: 'Phone Number & Emailid is not verified',
      });
    }
      bcrypt.compare(
        req.body.password,
        user[0].password,
        async (err, result) => {
          if (!result) {
            return res.status(401).json({
              msg: 'password matching failed',
            });
          }
          // genrate token
          if (result) {
            const token = jwt.sign(
              {
                _id: user[0]._id,
                email: user[0].email,
                name: user[0].name,
                userType: user[0].userType,
              },
              process.env.SECRET_KEY,
              //expire time
              {
                expiresIn: '24h',
              }
            );
            tokenModel.findOne(
              { email: req.body.email },
              function (err, user1) {
                if (err) return handleErr(err);
                if (user1 == null) {
                  const data = new tokenModel({
                    userID: user[0]._id,
                    token: token,
                    email: user[0].email,
                  });
                  data.save();
                } else {
                  user1.token = token;
                  user1.save(function (err) {
                    if (err) return handleErr(err);
                    //user has been updated
                  });
                }
              }
            );
            //final response
            const logData = new loginModel({
              userID: user[0]._id,
              userName: user[0].name,
            });
            try {
              await logData.save();
            } catch (error) {
              console.log(error);
            }

            res.status(200).json({
              _id: user[0]._id,
              userType: user[0].userType,
              email: user[0].email,
              name: user[0].name,
              token: token,
            });
          }
        }
      );
    });
};
}