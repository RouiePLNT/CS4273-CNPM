const express = require('express')
const morgan =  require('morgan')
const path = require('path')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose');

require('./config/passport') // pass passport for configuration

const session = require('express-session')
const MongoStore = require('connect-mongo')

const passport = require('passport');
const flash = require('connect-flash');

const route =  require('./routes')
const app = express()
const port = 3000


const db = require('./config/db')
//connect db
db.connect()
 
app.use(express.static(path.join(__dirname, "public" )))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
//app.use(morgan('combined'))

app.use(methodOverride('_method'))

app.engine('hbs', handlebars(
  {
    extname: '.hbs',
    helpers: {
          sum: (a, b) => a+b,
          minus: (a, b) => a-b,
          isExits: function( value, array, options)
          {
            //console.log(typeof(array))
            //console.log(array)           
            array = ( array instanceof Array ) ? array : [array]
            //array = ["6149ca087402824d501db618","618e3471c4882f19f1abd9f1","616d3cc18c388b3b0c761a15","6149ca087402824d501db618","616fe9794a4e4c88af1a7f5e"]
            //console.log(array)
            //console.log(value.toString())
            //console.log(array.indexOf(value))
            return (array.indexOf(value.toString()) > -1) ? options.inverse(this) : options.fn(this);
          },
          splitMongooseTimestamps: function(time)
          {
            var t = time.toString().split("GMT");
            return t[0];
          },

          check: function(num, options)
          {
              return (num != -1) ? options.fn(this) : options.inverse(this)
          },

          notzero: function(num, options)
          {
              return (num != 0) ? options.fn(this) : options.inverse(this)
          }
    }
  }
))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, "resources\\views" ))

//=========================
// app.use(session({
//   secret: 'adsa897adsa98bs',
//   resave: false,
//   saveUninitialized: false,
//   }))
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://Phuong:phuongne@cluster0.gmivy.mongodb.net/test',
  }),
  cookie: { maxAge: 30 * 60 * 1000 } //30 phut
}));

app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
//=========================



app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.currentUser = req.user;
  next();
});



// local host 127.0.0.1
route(app)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})





