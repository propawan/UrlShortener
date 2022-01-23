let express = require("express");
let router = express.Router();

let v1Routes = require("./v1/index");

router.use("/v1", v1Routes);

module.exports = router;
