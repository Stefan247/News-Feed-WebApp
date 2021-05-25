const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { createToken, validateToken } = require('../Auth/jwt');
const { AuthorizationFilter } = require('../Auth/middlewares');
const { send_confirmation_mail } = require('../Auth/confirmation');
require('dotenv/config');


router.get('/', validateToken, async (req, res) => {
    try {
        const returned_users = await User.find();
        res.json(returned_users);
    } catch(err) {
        res.json({ error: err });
    }
});

router.get('/:_id', async (req, res) => {
    try {
        const returned_user = await User.findById(req.params._id);
        res.json({ username: returned_user.username, email: returned_user.email, role: returned_user.role });
    } catch(err) {
        res.json({ error: err });
    }
});

router.get('/idByName/:username', async (req, res) => {
    try {
        const returned_user = await User.find({ username: req.params.username });
        const to_send_user = returned_user[0];
        res.json(to_send_user._id);
    } catch(err) {
        res.json(err);
    }
})

// Not used in frontend
router.post('/', AuthorizationFilter(["Admin"]), validateToken, async (req, res) => {
    const new_user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        email_token: crypto.randomBytes(64).toString('hex'),
        role: req.body.role
    });

    try {
        const saved_user = await new_user.save();
        res.json(saved_user);
    } catch(err) {
        res.json({ error: err });
    }
});

router.get('/auth/check', validateToken, (req, res) => {
    res.json(req.user);    
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        res.json({ error: "User doesn't exist!" });
    } else {
        if (!user.confirmed) {
            res.json({ error: "Please confirm your email address!" })
        } else {
            const dbPassword = user.password;
            await bcrypt.compare(password, dbPassword).then((match) => {
                if (!match) {
                    res.json({ error: "Wrong password!" });
                } else {
                    const access_token = createToken(user);
                    res.json({access_token: access_token, username: user.username, _id: user._id, role: user.role});
                }
            });
        }
    }
});

router.post('/register', async (req, res) => {
    const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });

    if (user) {
        res.json({ error: "User already registered!" });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const new_user = new User({
            username: req.body.username,
            password: hash,
            email: req.body.email,
            email_token: crypto.randomBytes(64).toString('hex'),
            role: req.body.role
        });
        try {
            const registered_user = await new_user.save();
            address_from = req.headers.host;
            send_confirmation_mail(address_from, registered_user);
            res.json({ message: `Sent email confirmation for ${ registered_user.username }!` });
        } catch(err) {
            res.json({ error: err });
        }
    }
});

router.get('/signup/verify-email', async (req, res) => {
    try {
        const user = await User.findOne({ email_token: req.query.token });
        if (!user) {
            res.json({ error: "Invalid account activation token!" });
        } else {
            const elapsed_minutes = (new Date().getTime() - user.email_token_date.getTime()) / (1000 * 60);
            if (elapsed_minutes < 15) {
                user.confirmed = true;
                user.email_token = "";
                const confirmed_user = await user.save();
                res.json({ message: `Account successfully confirmed, ${confirmed_user.username}, you can now login!` });
            } else {
                user.email_token = crypto.randomBytes(64).toString('hex');
                user.email_token_date = new Date();
                address_from = req.headers.host;
                send_confirmation_mail(address_from, user);
                const confirmed_user = await user.save();
                res.json({ message: `Sadly, this link has expired, but we've sent a new email confirmation at ${ confirmed_user.email }!` });
            }
        }
    } catch(err) {
        res.json({ error: "Account activation error!" });
    }
});

router.put('/:_id', validateToken, async (req, res) => {
    try {
        await User.updateOne({ _id: req.params._id },
            { $set: { role: req.body.role } });
        res.json({ message: "Role changed successfully" });
    } catch(err) {
        res.json({ error: err });
    }
});

// Not used in frontend
router.delete('/', AuthorizationFilter(["Admin"]), validateToken, async (req, res) => {
    try {
        const removed_users = await User.deleteMany({});
        res.json(removed_users);
    } catch(err) {
        res.json({ error: err });
    }
});

router.delete('/:_id', validateToken, async (req, res) => {
    try {
        const removed_user = await User.deleteOne({ _id: req.params._id });
        res.json(removed_user);
    } catch(err) {
        res.json({ error: err });
    }
});

module.exports = router;
