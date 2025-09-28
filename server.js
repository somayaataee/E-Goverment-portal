const pool = require("./db"); 
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const path = require("path");
dotenv.config();
const cookieParser = require("cookie-parser");

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,     
      sameSite: "none",  
      maxAge: 1000 * 60 * 60 
    },
  })
);
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const officerRoutes = require("./routes/officerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes"); 
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const contactRouter = require("./routes/contact");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/auth", authRoutes);
app.use("/citizen", citizenRoutes);
app.use("/officer", officerRoutes);
app.use("/admin", adminRoutes);
app.use("/services", serviceRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/", contactRouter);



app.get("/", (req, res) => {
 
  const user = (req.session && req.session.user) || req.user || null;
  res.render("landing", { user });
});
app.get("/about", (req, res) => {
  const user = (req.session && req.session.user) || null;
  res.render("about", { user });
});



app.get("/contact", (req, res) => {
  const user = (req.session && req.session.user) || req.user || null;
  res.render("contact", { user, message: null, error: null });
});


app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.render("contact", { error: "please fiil out all fields!", message: null, user: req.user || null });
    }


    await pool.query(
      "INSERT INTO contacts (name, email, message, created_at) VALUES ($1,$2,$3,NOW())",
      [name, email, message]
    );
    return res.render("contact", { message: "massage succsefully submited!", error: null, user: req.user || null });
  } catch (err) {
    console.error("Contact POST Error:", err);
    return res.render("contact", { error: "massege erorr", message: null, user: req.user || null });
  }
});

app.get("/how", (req, res) => {
  const user = (req.session && req.session.user) || req.user || null;
  res.render("how", { user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});



