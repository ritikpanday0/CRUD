const { Schema, mongoose } = require('mongoose');

const loginHistory = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model('userlogin', loginHistory);
