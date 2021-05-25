const User = require('../models/user');


const AuthorizationFilter = (permissions) => {
    return async (req, res, next) => {
        const user_role = req.body.role;
        if (permissions.includes(user_role)) {
            next();
        } else {
            return res.json({ error: "You don't have permission to do that!" });
        }
    }
};

module.exports = { AuthorizationFilter };
