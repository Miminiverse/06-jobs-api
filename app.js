require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
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

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
//

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per 15 mins
}))
app.use(express.json());
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(xss())




// extra packages

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/todos',authenticationMiddleware, todosRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5051;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
