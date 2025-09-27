
exports.isCitizen = (req, res, next) => {

  if (!req.user) return res.redirect("/citizen/login");
  if (req.user.role === "citizen") return next();

  return res.redirect("/citizen/login");
};

exports.isOfficer = (req, res, next) => {
  if (!req.user) return res.redirect("/officer/login");
  if (req.user.role === "officer" || req.user.role === "department_head") return next();
  return res.redirect("/officer/login");
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.redirect("/admin/login");
  if (req.user.role === "admin") return next();
  return res.redirect("/admin/login");
};
