
var Memcached = require('memcached');
var memcached = new Memcached();
const Model = require('../models/usersModel');
require('dotenv');

const otpClass=require('../utility/otp');



module.exports.emailSend=(req,res)=>
{
    const  c=new otpClass();
    c.otpGenerate();
    const send=c.sendEmail(req,res);
    if(send){
    
    res.status(200).send("otp send successfully");
    console.log("otp send successfully");
    }
    else{
        res.status(401).send("otp not send  successfully");
    }
}


module.exports.emailVerify=async(req,res)=>{
    const user=await Model.findOne({email: req.body.email})
    const email=req.body.email;
      
    if(user.isEmailVerified!=true){
        memcached.get(`${email}`,  function (err, data) {
     
            console.log(data);
            if(data.otp===req.body.otp){
                        async function saveVerified(){
                          user.isEmailVerified=true;
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
    res.status(200).send("otp verified already");
}
}