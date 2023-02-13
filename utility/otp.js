require('dotenv');
const mem=require('../services/memcache');
var Memcached = require('memcached');

const nodemailer=require('nodemailer');
var memcached = new Memcached();
const transporter=nodemailer.createTransport({
    service:process.env.service,
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }
});
module.exports=class Otp{
    setclient(){
      this.client=require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

    }
    otpGenerate() {
       this.otp=Math.floor(Math.random() * 100000);
        
      return this.otp;
    }


    PhoneSendOtp(req,res){
      const phoneNumber=req.body.phoneNumber;
      this.client.messages
      .create({body: `your otp is ${this.otp}`, from: process.env.from, to: phoneNumber})
      .then(data=>{
        let val=this.otp;
        const memData={otp:val,
        phoneNumber}
        
          mem.addMem(memData);
         res.status(200).send("Successfully send Otp");
})

    }

    phoneVerifyOtp(req,res){
      
    const phoneNumber=req.body.phoneNumber;
    const otp=req.body.otp;
    var val=false;
    memcached.get(`${phoneNumber}`,  function (err, data) {
     
    

    if(otp==data.otp){
        
        val= true;
       

    }

   
        
      });
      console.log(val);
      return val;  
    }

    async sendEmail(req,res){
      const email=req.body.email;
      const val=this.otp;
      transporter.sendMail({
          from:process.env.user,
          to:email,
          subject:process.env.subject,
          
          text:process.env.text+"email="+email+'&code='+this.otp
      },async function(err,info){
      if(err){ 
          res.status(401).send("some error in sending");
          return false;
         
      }
      else{
      
        const data={otp:val,
        email:req.body.email}
        mem.addMem(data);
  
    }
})
return true;
    }

    emailOtpVerified(req,res){
      const email=req.body.email;
      const otp=req.body.otp;
      memcached.get(`${email}`,  function (err, data) {
          if(data==undefined){
              res.status(401).send("otp Expired Try again");
          return false;
          }
      if(otp!==data.otp){
          res.status(401).send("otp verification  failed");
          return false;
         
  
      }
          
        });
      return true;
    }
  }
  
 
  