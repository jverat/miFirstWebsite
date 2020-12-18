import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import passport, { Strategy } from "passport";
const MongoStore = require("connect-mongo")(session);
const LocalStrategy = require("passport-local").Strategy;

import indexRoutes from "./routes/indexRoutes";
import userRoutes from "./routes/UserRoutes";
import User from "./models/User";

const KEY: string = "contraseña123";
const MONGO_URI: string = "mongodb://localhost/mfws";

/* errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

}*/

interface user {
  username: string;
  password: string;
  salt: string;
  email: string;
}

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    //DB setup
    mongoose
      .connect(process.env.MONGODB_URL || MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then((db) => console.log("DB is connected"));
    mongoose.connection.once("error", (err) => console.log(err) |);

    //Settings
    this.app.set("key", KEY);
    this.app.set("port", process.env.PORT || 3000);

    //Middlewares
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());

    //Passport config
    const sessionStore = new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: "sessions",
    });

    this.app.use(
      session({
        secret: KEY,
        store: sessionStore,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    );
    this.passportConfig();
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    //this.app.use(errorHandler);
  }

  routes() {
    this.app.use(indexRoutes);
    this.app.use(this.consoleOutput);
    this.app.use("/user/", userRoutes.router);
  }

  consoleOutput(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log(req.session);
    console.log(req.user);
    next();
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }

  passportConfig() {
    const verifyCallback = (username: string, password: string, done: any) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) return done(null, false);

          if (
            userRoutes.checkPass(
              password,
              user.get("password"),
              user.get("salt")
            )
          ) {
            console.log(user.get("username") + " validated");
            return done(null, user);
          } else return done(null, false);
        })
        .catch((err) => done(err));
    };

    passport.serializeUser((user: user, done) => {
      done(null, user.username);
    });

    passport.deserializeUser((username: string, done) => {
      User.findOne({ username: username }, (err, user: Document | null) => {
        done(err, user);
      }).catch((err) => done(err));
    });

    passport.use(
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
        },
        verifyCallback
      )
    );
  }
}

const server = new Server();
server.start();

export default server;