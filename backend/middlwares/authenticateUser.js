const jwt = require("jsonwebtoken")

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        
        if (!token || token === 'null' || token === 'undefined') {
            throw new Error("Token not found")
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Check if the error is due to an expired token
                if (err.name === 'TokenExpiredError') {
                    throw new Error("Session expired")

                }
                // Handle other possible token verification errors
                throw new Error("Invalid token")

            }

            // Token is verified, attach user info to request object and proceed
            
            req.user = user;
            next();
        });
    } catch (error) {
          return res.status(500).json({status:false , error:error.message})
    }


}

module.exports = authenticateUser