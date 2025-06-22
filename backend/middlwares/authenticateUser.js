const jwt = require("jsonwebtoken")

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Unauthorized request! Missing or invalid token format.');
        }

        const token = authHeader.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined') {
            throw new Error('Unauthorized request! Token is empty or invalid.');
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
        return res.status(500).json({ status: false, error: error.message })
    }


}

module.exports = authenticateUser