const jwt = require("jsonwebtoken");

/* ----------------------------- Token generator ---------------------------- */
const tokengenerate = (id) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  return token;
};

module.exports = tokengenerate;
