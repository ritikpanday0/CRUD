
const express    = require("express");
var Memcached = require('memcached');
const app = express();
const port = Number(process.env.PORT || 5000);
 
// make connection with memcached server
var memcached = new Memcached();
memcached.connect( '127.0.0.1:11211', function( err, conn ){
  if( err ) {
     console.log( conn.server );
  }

});
module.exports.addMem=function(data){ 

const  profile=data;
let val;
if(data.email==undefined){
  val=data.phoneNumber;
}
else{
  val=data.email;
}
// create your profile key where user personal information will be store in json format.               
memcached.set(`${val}`, profile, 6000, function (err) { 
  if(err) throw new err;
 
});

 
 


}




console.log("Listening on "+port+", Web URL: http://localhost:"+port);
app.listen(port);