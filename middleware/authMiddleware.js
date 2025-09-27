const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.redirect("/citizen/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.redirect("/citizen/login");
  }
};


exports.verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).send("Access denied");
    next();
  };
};
