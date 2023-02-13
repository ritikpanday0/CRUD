const { boolean } = require('joi');
const { Schema, mongoose } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required:true,
      unique: true,
    },
    image:{
      type:String,
    },
    isPhoneVerified:{
      type:Boolean,
      default:false
    },
    isEmailVerified:{
      type:Boolean,
      default:false
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);
