var jwt = require('jsonwebtoken');
const JWT_SECRET = 'abc3477@!23';

const fetchuser = (req , res , next) =>{
  //Get the user from the jwt token and add id to req object
  const token  = req.header('auth-token');
if(!token){
  res.status(401).send({error : "Please authenticate using a valid token"})
}
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.user = data.user; // id of the user
  } catch (error) {
    res.status(401).send({error: "Please authenticate using a valid token"})
  }
  next()
}   

//we are confirming here that the user who tried to logged in using token did he got the right token so we can have his details
module.exports = fetchuser;
