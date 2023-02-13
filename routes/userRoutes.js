const express = require('express'); //import express

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const joiValidator = require('../services/joi_validation');
const imageController=require("../controllers/imageController");
const auth=require('../lib/middleware/auth');
const phoneNumber=require('../services/PhoneNumber');
const email=require('../services/EmalVerification');
const password=require('../services/forget_reset');
router.post('/login', joiValidator.loginValidation, authController.login);
router.post('/create', joiValidator.createValidation, userController.create);
router.delete('/delete/:id',auth, userController.delete);
router.patch('/update/:id',auth, userController.edit);
router.get('/getUser', userController.getAll);
router.get('/getOne/:id', auth,userController.getOne);


router.post('/image/:id',auth,imageController.image,imageController.updateImage)

router.get('/logout/:id',auth,userController.logout);

router.post('/send-otp',phoneNumber.sendMessage);

router.post('/verifyOtp',phoneNumber.verifyOtp);
 router.post('/sendEmailOtp',email.emailSend);
 router.post('/verifyEmailOtp',email.emailVerify);
 router.patch('/resetpasswordByPhone',password.forgetByPhoneNumber);
 
 router.patch('/resetpasswordEmail',password.forgetByEmail);
module.exports = router; // export to use in server.js[']
