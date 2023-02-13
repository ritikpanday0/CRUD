const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');

const redis = require('redis');
const redisPort = 6379;
const tokenModel=require('../models/tokenModel');

// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(password, 10),
    phoneNumber:req.body.phoneNumber,
    image:"demo.jpg",
  });
  try {
    if (req.body.password !== req.body.password2) {
      return res.status(400).send('Passwords dont match');
    }

    let user = await Model.findOne({ email: req.body.email });
    if (user) return res.status(400).json('User already registered.');

    const dataToSave = await data.save();

    // sending Email

   

    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get th single data with the help of id
module.exports.getOne = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

console.log(jwt.verify(token,'this is dumy text'))
    let userId;
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;
        const user_id=user1._id
 console.log(user_id)
        
          if (userId.toString() == id) {
            async function asyncCall() {
              const data = await Model.findById(req.params.id);
              res.json(data);
            }
            asyncCall();
} else {
  res.send(`param or token invalid..`);
}
});
}
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get All the data with the help of id
module.exports.getAll = async function (req, res, next) {
  const limitValue = req.query.limit || 2;
  let skipValue = req.query.skip || 0;
  const key = 'getAll' + skipValue.toString() + limitValue.toString();
  try {
    const client = redis.createClient(redisPort);
    client.connect();
    // const data = await Model.find();
    // use redis for caching
    client.expire(key, 10);
    const data = await client.get(key);
    if (data) {
      res.json(JSON.parse(data));
    } else {
      Model.paginate({}, { page: req.query.skip, limit: req.query.limit });

      {
        skipValue = skipValue * limitValue;
        const data = await Model.find().limit(limitValue).skip(skipValue);
        //console.log(client);
        await client.set(key, JSON.stringify(data));
        return res.json(data);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// updated the data

module.exports.edit = async function (req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: 'Data to update can not be empty!',
      });
    }
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;
        
 console.log(userId)
        
          if (userId.toString() == id) {
            async function asyncCall() {
              const data = await Model.findByIdAndUpdate(id, req.body, {
                useFindAndModify: false,
              });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Deleted the data help of id
module.exports.delete = async function (req, res, next) {
  try {
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;
        const user_id=user1._id
 console.log(user_id)
        
          if (userId.toString() == id) {
            async function asyncCall() {
              const data = await Model.findByIdAndDelete(id);
              const data1 = await tokenModel.findByIdAndDelete(user_id);
    res.send(`Document with ${data.name} has been deleted..`);
            }
            asyncCall();
} else {
  res.send(`param or token invalid..`);
}
});
}
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




module.exports.logout=async (req, res, next)=>{
  try {
    let userId;
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;
        const user_id=user1._id
 console.log(user_id)
        
          if (userId.toString() == id) {
            async function asyncCall() {
              const data = await tokenModel.findByIdAndDelete(user_id);
              res.send(`successfully logout.`);
            }
            asyncCall();
} else {
  res.send(`param or token invalid..`);
}
});
}
} catch (error) {
res.status(400).json({ message: error.message });
}
};