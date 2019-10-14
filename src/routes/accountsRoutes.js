const { Router } = require('express');
const router = Router();
const passport = require('passport');



const accountsController = require('../controllers/accountsController');

router.route('/register')
.get((req, res) => {
    console.log(req.user)
    console.log(req.isAuthenticated());
    const query = req.query;
    if( query.email ) {
        accountsController.checkIfEmailExists(req, res);
    } else if ( query.username ) {
        accountsController.checkIfUsernameExists(req, res);
    } else res.send('Bad request');
}).post(accountsController.registerNew);

router.get('/check/:q', (req, res) => {
    if (req.params.q === 'username') {
        accountsController.checkIfUsernameExists(req, res);
    } else {
        accountsController.checkIfEmailExists(req, res);
    }
})

router.post('/login', passport.authenticate('local', { session: true }), accountsController.login);

module.exports = router;