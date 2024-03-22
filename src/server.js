import express from "express";
import ProductRouter from "./routes/products.routes.js";
import CartRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import {__dirname} from "./utils/utils.js";
import mongoose from "mongoose";
import messageDao from "./Services/daos/dbManager/message.dao.js";
import UserViewsRouter from "./routes/users.views.routes.js"
import SessionRouter from "./routes/session.routes.js"
import MongoStore from 'connect-mongo';
import session from "express-session";
import githubLoginRouter from "./routes/github-login.views.routes.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "../src/config/config.js";
import Mockrouter from "./routes/mock.routes.js"
import { addLogger } from "./utils/logger.js";

const Host = express()
const SERVER_PORT = config.port
const MONGO_URL = config.urlMongo

const httpServer = Host.listen(SERVER_PORT,()=>{
    console.log(`Initiating server at port: ${SERVER_PORT}...`)
})
mongoose.connect(MONGO_URL)
.then(() => {
    console.log('Connection established')
})
.catch(error => {
    console.error('Connection failed', error)
});
const io = new Server(httpServer)

Host.use(addLogger)
Host.use(express.json())
Host.use(express.urlencoded({extended: true}))

Host.engine("hbs", handlebars.engine({
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    ifEquals: function(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
    }
  }
}))


Host.set("view engine", "hbs")
Host.set("views", `${__dirname}/views`)

Host.use(express.static(`${__dirname}/public`))

Host.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    mongoUrl: MONGO_URL,
    ttl: 10 * 60, 
  }),
  secret: "I1ik3C00k13s",
  resave: false,
  saveUninitialized: true,
}));
initializePassport()
Host.use(passport.initialize())
Host.use(passport.session())
io.on('connection', (socket) => {
    console.log('new client connected')
  
    socket.on('chat message', async (msg) => {
      try {
        await messageDao.createMessage({ user: msg.user, message: msg.content })
      } catch (error) {
        console.log(error)
      }
      io.emit('chat message', msg)
    })
  })

Host.use(express.json())
Host.use(express.urlencoded({extended:true}))

Host.use("/api/products", ProductRouter)
Host.use("/api/carts", CartRouter)
Host.use("/", ViewsRouter)
Host.use("/",Mockrouter )
Host.use("/api/sessions",SessionRouter)
Host.use("/users",UserViewsRouter)
Host.use("/github", githubLoginRouter)
