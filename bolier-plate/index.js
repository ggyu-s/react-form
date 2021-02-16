const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const db = require("./models");
const { User } = require("./models");
const app = express();
const port = 5000;

db.sequelize
  .sync()
  .then(() => {
    console.log("db connected");
  })
  .catch(console.error);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!! test"));

app.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(400).json({
        failure: "이메일이 없습니다.",
      });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(400).json({
        failure: "비밀번호가 틀렸습니다.",
      });
    }
    const token = await jwt.sign(
      {
        useremail: user.email,
        username: user.name,
      },
      "sEcretKey"
    );
    // await User.update(
    //   {
    //     token,
    //   },
    //   {
    //     where: { email: user.email },
    //   }
    // );
    res.cookie("authCookie", token, { httpOnly: true, maxAge: 900000 });
    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      failure: "에러",
      error: error,
    });
    next(error);
  }
});

app.listen(port, () => console.log("server start"));
