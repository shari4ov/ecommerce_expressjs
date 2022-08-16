// get config vars
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

dotenv.config();
process.env.TOKEN_SECRET;
function authenticateToken(req, res, next) {
       console.log(req.get('authorization'));
       const authHeader = req.get('authorization')
       const token = authHeader && authHeader.split(' ')[1]
       if (token == null) return res.sendStatus(401)
       const decode = jwt.verify(token,process.env.TOKEN_SECRET)
       if(decode && decode.id === req.body.userId) {
              next()
       } else {
              return res.sendStatus(401)
       } 
}
module.exports= {
       authenticateToken
}