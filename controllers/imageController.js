const path = require("path");
const Model = require('../models/usersModel');
const tokenModel = require('../models/tokenModel');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
 
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
    if (mimetype && extname) {
       return cb(null, true);
    }
 
    cb(`Error in uploading file please upload only ${filetypes}`);
 };
  
  const upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5,
 },
 fileFilter: fileFilter, })
  
  
  
  //exports.uploadProfilePhoto = upload.single('images');
  
  module.exports.image=upload.single("images");
  
  
  
  
  module.exports.updateImage=async(req, res) => {
    const id = req.params.id;
   
     let update={};
     update.image=req.file.filename;


    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;
        
   
          console.log(id);
          if (userId.toString() == id) {

            async function asyncCall() {
    const data = await Model.findByIdAndUpdate(id, update, {
      useFindAndModify: false,
    });
    console.log(update);
    if (!data) {
        res.status(404).send({
          message: `Cannot update model with id=${id}. Maybe model was not found!`,
        });
            } else res.send({ message: 'DATA was updated successfully.' });
}
    asyncCall();
} else {
  res.send(`param or token invalid..`);
}
});
          
        }
        
    
        
        } 
    //    console.log("hii");

