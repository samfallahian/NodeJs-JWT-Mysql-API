const controller = require("../controllers/users");
const validateToken = require("../middlewares/utils.js").validateToken;

module.exports = (router) => {
  router
    .route("/users")
    .get(validateToken, controller.getAll)
    .post(controller.create);

  router.route("/login").post(controller.login);
  router.route("/refresh_token").post(controller.token);
  router.route("/users/me").post(validateToken, controller.me);
};