const express = require('express');
const session = require('express-session')
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const { format } = require('timeago.js');

const app = express();
require('./database');
app.use(express.static(path.join(__dirname, 'public')));

//Global variables
const { PORT } = require('./configuration/config');
app.use((req, res, next) => {
  app.locals.format = format;
  next();
})

//Middlewares
app.use('/*',(req, res, next) => {
	// console.log(req);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'culopelao',
    saveUninitialized: true,
    resave: true
}))
const passportMiddleware = require('./middleware/passport');
app.use(passport.initialize());
app.use(passport.session());
passport.use(passportMiddleware);

//Routes
const accountRoutes = require('./routes/accountsRoutes');
const imageRoutes = require('./routes/imagesRoutes');
app.use(accountRoutes);
app.use(imageRoutes);

//Server start
app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
})