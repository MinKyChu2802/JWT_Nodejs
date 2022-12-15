import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import db from "./db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constant";

app.use(express.json());

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id}, "myRefreshSecretKey");
};

let refreshTokens: any = [];

let hash: any;

app.post("/api/sign-up", async (req: any, res: any) => {
  const { username, password, fullName } = req.body;
  const id = uuidv4();
  hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);

  let sql = `INSERT INTO users VALUE ('${id}', '${username}', '${hash}', '${fullName}');`;

  db.query(sql, (err, _) => {
    if (err) throw err;
    res.json({ id, username, fullName });
  });
});

/**
 * API Login
 */
app.post("/api/login", async (req: any, response: any) => {
  const { username, password } = req.body;

  let sql = `Select *  From users Where username='${username}'`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    const {password: passwordDB, username: usernameDB, id, fullName} = res[0]

    bcrypt.compare(password.toString(), passwordDB, (err, result) => {
      if(result && username ===usernameDB) {
        const accessToken = generateAccessToken({username: usernameDB, id,fullName });
        const refreshToken = generateRefreshToken({username: usernameDB, id,fullName});
        refreshTokens.push(refreshToken);
        response.json({
          accessToken,
          refreshToken,
          username: usernameDB,
          fullName
        });
      } else {
        response.status(400).json("Username or password incorrect!");
      }
    })
  });

 
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

app.listen(3000, () => console.log("Backend server is running!"));
