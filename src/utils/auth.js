const jwt = require("jsonwebtoken");

function newToken(user) {
  return jwt.sign({ id: user.UserId }, "relevel", {
    expiresIn: "10d",
  });
}

function verifyToken(token) {
  try {
    let response = jwt.verify(token, "relevel");
    return response;
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = { newToken, verifyToken };
