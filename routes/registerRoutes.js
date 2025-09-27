const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.render("register", { title: " citizen submit" });
});


router.post("/", (req, res) => {
  const { name, email, password, nationalId, birthDate } = req.body;

  console.log("new user information:", { name, email, password, nationalId, birthDate });

  res.send("succesfully submited!");
});

module.exports = router;
