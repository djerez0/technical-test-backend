import bcrypt from "bcrypt";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type StrategyOptions,
} from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { db } from "../db/db";
import { JWT_SECRET_KEY } from "../utils/jwt";

passport.use(
  new LocalStrategy((username, password, done) => {
    db.read()
      .then(() => {
        const user = db.data.users.find((user) => user.username === username);
        if (!user) return done(null, false, { message: "User not found" });

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch)
              return done(null, false, { message: "Wrong password" });
            return done(null, user);
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  }),
);

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, (payload, done) => {
    try {
      const user = { id: payload.sub, username: payload.username };
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);
