require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OAuthUser = require('./models/OAuthUser')
const OAuthAuthen = require("./middleware/OAuthAuthen")
const axios = require("axios")
const socket = require('socket.io');
const mongoose = require('mongoose')

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// authentication
const authenticationMiddleware = require('./middleware/authentication')

//connect DB
const connectDB = require('./db/connect')


// routers

const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')
const OtodosRouter = require('./routes/Otodos')
const commentRouter = require('./routes/comment')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { isObjectBindingPattern } = require('typescript');
//


app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per 15 mins
}))
app.use(express.json());
app.use(cookieParser())
app.use(helmet())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(xss())
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
)

//Passport Google OAuth

app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser((user, done) => {
  return done(null, user._id)
} )

passport.deserializeUser((id, done) => {
  OAuthUser.findById(id, (err, doc) => {
    return done(null, doc)
  })
})

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {


  OAuthUser.findOne({ googleId : profile.id}, async (err, doc) => {
    
    if (err) {
      return cb (err, null)
    }
    if (!doc) {
      const newOAuthUser =  new OAuthUser({
        googleId: profile.id,
        username: profile.name.givenName
      })
      await newOAuthUser.save()
      cb(null, newOAuthUser)
    }
    cb(null, doc)
  })
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: true }),
  function (req, res) {
    res.redirect('http://localhost:5173/oauth/todo')
}
  );


app.get("/account", OAuthAuthen, (req,res) => {
  const user = {
    ...req.user,
    loggedIn: true
  }
  res.json(user)
})


app.get('/auth/logout', (req, res) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        // Handle error during logout
        return res.status(500).send('Error during logout');
      }
      res.send('success');
    });
  } else {
    res.send('No user session');
  }
});


// extra packages

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/todos',authenticationMiddleware, todosRouter)
app.use('/api/v1/oauth/todos', OAuthAuthen, OtodosRouter)
app.use('/api/v1/oauth/todos/comment', OAuthAuthen, commentRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5051;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

  const server = app.listen(port, () => {
    console.log(`listen to ${port}`);
})

const io = socket(server,  {
    cors: {
        origin: true,
        credentials: true,
    }
});




global.onlineUsers = new Map()

io.on("connection", (socket) => {
    global.chatSocket = socket

    socket.on("online-user", (username, userId) => {
      onlineUsers.set(userId, socket.id)
      console.log(`User ${username} connected!`);
    })
})
