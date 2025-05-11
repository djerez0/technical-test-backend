import { Router } from "express";
import passport from "passport";

import { logOut, signIn, signUp } from "../controllers/auth.controller";
import { checkBlackList } from "../middlewares/check-blacklist.middleware";
import { validate } from "../middlewares/validation";
import { signInSchema } from "../schemas/sign-in.schema";
import { signUpSchema } from "../schemas/sign-up.schema";

const router = Router();

router.post(
  "/sign-in",
  validate(signInSchema),
  passport.authenticate("local", { session: false }),
  signIn,
);

router.post("/sign-up", validate(signUpSchema), signUp);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  logOut,
);

export default router;
