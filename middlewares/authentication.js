const { validateToken } = require("../services/authentication");

function checkForAuthentication(cookieName){
    return (req,res,next)=>{
        const tokencookievalue = req.cookies[cookieName];
        if(!tokencookievalue){
            return next();
        }
        try{
            const userPayload = validateToken(tokencookievalue);
            req.user = userPayload;
        }catch(err){}
        return next();

    }
}
module.exports = {checkForAuthentication}