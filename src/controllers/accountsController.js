const User = require('../models/User');
const bcrypt = require('bcryptjs');


module.exports = {

    checkIfEmailExists: (req, res) => {
        
        User.findOne({ email: req.query.v.trim().toLowerCase() }).then( user => {
            if (user) 
                return res.status(400).json({
                    ok: false,
                    msg: 'User already exists'
                });
            return res.status(200).json({
                ok: true,
                msg: 'User does not exists'
            });
        })
    },

    checkIfUsernameExists: (req, res) => {
        User.findOne({ username: req.query.v.trim().toLowerCase()}).then( user => {
            console.log(user);
            if (user) 
                return res.status(400).json({
                    ok: false,
                    msg: 'Username already exists'
                });
            return res.status(200).json({
                ok: true,
                msg: 'Username is available'
            });
        })
    },

    registerNew: (req, res) => {
        const user = new User({...req.body});
        const birthdate = new Date(req.body.birthdate);
        user.birthdate = birthdate;

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then( user => {
                    return res.status(200).json(user);
                })
                .catch( err => res.status(400).json({
                    msg: err.message
                }) );
            })
        })
    },

    login: (req, res) => { 
        return res.status(200).json({
            user: req.user,
            msg: 'Authentication successful'
        })
    }
}