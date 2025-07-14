const jwt = require('jsonwebtoken');

const secret_key = "8ATMAN$ruce";
function createToken(user){
    const payload = {
        _id : user._id,
        email : user.email,
        profileImageUrl : user.profileImageUrl,
        role : user.role,
    }
    const token = jwt.sign(payload,secret_key);
    return token;
}
function validateToken(token){
    const payload = jwt.verify(token,secret_key);
    return payload;
}

module.exports = {createToken,validateToken};