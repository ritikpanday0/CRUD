require('dotenv');
const Model = require('../models/usersModel');
const OTP = require('../models/otpModel');

const client=require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
module.exports.otpSend=async(req,res)=>{
  phoneNumber=req.query.phoneNumber
  channel="sms"
  client.verify.services(process.env.TWILIO_SERVICE_ID).verifications.create({
    to:`+91${phoneNumber}`,
    channel:channel
  }).then((data)=>{
res.status(200).send(data);
  })
}
module.exports.verify=async(req,res)=>{
    const phoneNumber=req.query.phoneNumber
  const user=await Model.findOne({phoneNumber:phoneNumber})
  
  const code=req.query.code
  client.verify.v2.services(process.env.TWILIO_SERVICE_ID).verificationChecks.create({
    to:`+91${phoneNumber}`,
    code:code
  }).then ( async(verification_check )=>{
    res.status(200).send(verification_check);

    console.log(verification_check.status)
  if(verification_check.status=="approved"){
   user.isPhoneVerified=true;
  
   await user.save();
   
  
  }
 

})
}

module.exports.sendMessage=(req,res)=>{
  const otp=Math.floor(Math.random() * 100000);
  const date = new Date();
  const minutesToAdd=10;
const currentTime=date.getTime()+ minutesToAdd*60000;
console.log(currentTime)
  const phoneNumber=req.body.phoneNumber
client.messages
      .create({body: `your otp is ${otp}`, from: '+18304654833', to: phoneNumber})
      .then(data=>{
        Model.find({ phoneNumber: req.body.phoneNumber })
        .exec()
        .then((user) => {
        
          if (user.length < 1) {
            return res.status(401).json({
              msg: 'user no exit',
            });
          }
          OTP.find({ phoneNumber: req.body.phoneNumber })
        .exec()
        .then(async(user1) => {
          
          if (user1.length < 1) {
            const data = new OTP({
              userID: user[0]._id,
              phoneNumber: phoneNumber,
              otp: otp,
              expireTime:currentTime
            });
            data.save();
          }

        
        
              else {
                user1[0].otp = otp;
                user1[0].expireTime=currentTime
                await user1[0].save();
              }
            }
          );
        })
      
        res.status(200).send(data);
})

}

module.exports.verifyOtp=async(req,res)=>{
  
  const date = new Date();
  
const currentTime=date.getTime();
  OTP.find({ phoneNumber: req.body.phoneNumber })
  .exec()
  .then(async(user1) => {
    console.log(user1[0].expireTime-currentTime)
    if(user1[0].otp===req.body.otp && user1[0].expireTime>=currentTime){
      const user=await Model.findOne({phoneNumber: req.body.phoneNumber})
      user.isPhoneVerified=true;
  
      await user.save();
      res.status(200).send(user);
    }
    else{
      res.status(401).send('otp Expired or Otp not mached');
    }
  })
}