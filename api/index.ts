import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import db from "./db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constant";

app.use(express.json());

const users = [
  {
    id: "1",
    username: "john",
    password: "John0908",
    isAdmin: true,
  },
  {
    id: "2",
    username: "jane",
    password: "Jane0908",
    isAdmin: false,
  },
];

let refreshTokens: any = [];

app.post("/api/sign-up", async (req: any, res: any) => {
  const { username, password, fullName } = req.body;
  const id = uuidv4();
  const hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);

  let sql = `INSERT INTO users VALUE ('${id}', '${username}', '${hash}', '${fullName}');`;

  db.query(sql, (err, _) => {
    if (err) throw err;
    res.json({ id, username, fullName });
  });
});

/**
 * API Login
 */
 app.post("/api/login", (req: any, res: any) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

app.post("/api/refresh", (req: any, res: any) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err: any, user: any) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter(
      (token: any) => token !== refreshToken
    );

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
};



app.listen(3000, () => console.log("Backend server is running!"));
