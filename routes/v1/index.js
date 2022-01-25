let express = require("express");
let router = express.Router();

const urlController = require("../../src/controllers/urlController");
const userController = require("../../src/controllers/userController");

router.route("/allUrls").get(urlController.listUrls);
router.route("/gethash").get(urlController.getHash);

router.get(
  "/shortUrls",
  userController.isAuthenticated,
  urlController.getUserUrls
);

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
