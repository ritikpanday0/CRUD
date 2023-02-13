require('dotenv');
const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const otpClass=require('../utility/otp');
var Memcached = require('memcached');
var memcached = new Memcached();
module.exports.forgetByPhoneNumber=async(req,res)=>{
    const phoneNumber=req.body.phoneNumber;
    memcached.get(`${phoneNumber}`,  function (err, data) {
     
        console.log(data);
        if(data.otp===req.body.otp){
                    async function saveVerified(){
                        const user=await Model.findOne({phoneNumber: req.body.phoneNumber})
                        user.password=await bcrypt.hash(req.body.password, 10);
                        await user.save();
                        res.status(200).send("password change sucessFully");
    
                    }
                    saveVerified();
                    
        }
        else{
          res.status(401).send("incorrect otp");
        }
      })
    
    
}
module.exports.forgetByEmail=async(req,res)=>{
    const  c=new otpClass();
    const verify=c.emailOtpVerified(req,res);
    if(verify==true){
        const user=await Model.findOne({email: req.body.email})
        user.password=await bcrypt.hash(req.body.password, 10);
        await user.save();
        res.status(200).send("password change sucessFully");
    
    }
    else{
        res.status(200).send("incorrect otp");
    }
}

