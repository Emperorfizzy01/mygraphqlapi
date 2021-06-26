const User = require('../model.js/User')
const jwt = require('jsonwebtoken') 
const { UserInputError } = require('apollo-server');



const newApiKey = async(emailAddress) => {
      const user = await User.findOne({ emailAddress })

      const payload = { id: user._id, emailAddress: user.emailAddress };
      const options = { expiresIn: '2d' };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, options)

      return { token } 
  }
  
const authenticate = async req => {
   const authorizationHeader = req.headers.authorization
   let result;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(' ')[1];
      const options = {
        expiresIn: '2d',
      };

        // verify makes sure that the token hasn't expired and has been issued by us
        const result = jwt.verify(token, process.env.JWT_SECRET, options);
        const { id } = result
        // Let's pass back the decoded token to the request object
        const user = await User.findById(id)
        return user
    } else {
      return
      };
  };





module.exports = { newApiKey , authenticate } 