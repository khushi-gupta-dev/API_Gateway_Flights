const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { serverConfig } = require("../../config");
 function checkPassword(plainPassword, encryptedPassword) {
  try {
   return brypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    throw error; 
  }
  }
  
 function createToken(input) { 
    try {
    return jwt.sign(input, serverConfig.JWT_SECRET, { expiresIn: serverConfig.JWT_EXPIRY });
    }
    catch (error) {
        throw error;
    }

}


function verifyToken(token) {
    try {
        const response = jwt.verify(token, serverConfig.JWT_SECRET);
        return response;
    } catch (error) {
        throw error;
    }
}
 module.exports = {
  
     checkPassword,
     createToken,
     verifyToken
}; 