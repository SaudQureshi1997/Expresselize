import * as router from "@utils/router";
import * as auth from "@controllers/authcontroller";
import authMiddleware from "@middlewares/auth";

/**
 * @param {router} router
 */
const authenticatedOnly = (router) => {
  router.get("me", auth.me);
};

/**
 * @param {router} router
 */
const authGrouped = (router) => {
  router.post("register", auth.register);
  router.post("login", auth.login);
  router.group("", authenticatedOnly, [authMiddleware]);
};

router.group("auth", authGrouped);

export default router;
