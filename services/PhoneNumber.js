require('dotenv');
const Model = require('../models/usersModel');
const otpClass=require('../utility/otp');
var Memcached = require('memcached');
var memcached = new Memcached();


module.exports.sendMessage=(req,res)=>{
  const  c=new otpClass();
  c.otpGenerate();
  
  c.setclient()
c.PhoneSendOtp(req,res);


}

module.exports.verifyOtp=async(req,res)=>{
  const phoneNumber=req.body.phoneNumber;
  const user=await Model.findOne({phoneNumber: phoneNumber})
  if(user.isPhoneVerified!=true){
  // const  c=new otpClass();
  // const verify=c.phoneVerifyOtp(req,res);
  memcached.get(`${phoneNumber}`,  function (err, data) {
     
    console.log(data);
    if(data.otp===req.body.otp){
                async function saveVerified(){
                  user.isPhoneVerified=true;
      await user.save();

                }
                saveVerified();
                res.status(200).send("otp verified successfully");
    }
    else{
      res.status(401).send("user verified failed");
    }
  })
  
          
     
  
  
}
else{
  res.status(200).send("user is already verified");
}
}  