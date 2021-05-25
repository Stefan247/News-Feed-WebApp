const { sign, verify } = require('jsonwebtoken');
require('dotenv/config');


const createToken = (user) => {
    const access_token = sign({ username: user.username, role: user.role, _id: user._id }, process.env.JWT_KEY);
    return access_token;
}

const validateToken = (req, res, next) => {
    const access_token = req.header('access_token');
    if (!access_token) {
        return res.json({ error: "User not Authenticated! Log in!" });
    } else {
        try {
            const valid_token = verify(access_token, process.env.JWT_KEY);
            req.user = valid_token;
            if (valid_token) {
                return next();
            }
        } catch(err) {
            return res.json({ error: err });
        }
    }
}

module.exports = { createToken, validateToken };
