import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import db from "./db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { MY_SECRET_KEY, SALT_ROUNDS } from "./constant";
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id }, MY_SECRET_KEY, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, MY_SECRET_KEY);
};

let refreshTokens: any = [];

let hash: any;

// -----------Users-----------------
/**
 * API create users account
 */
app.post("/api/sign-up", async (req: any, res: any) => {
  const { username, password, fullName, isAdmin } = req.body;
  const id = uuidv4();
  hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);

  let sql = `INSERT INTO users VALUE ('${id}', '${username}', '${hash}', '${fullName}', '${isAdmin}');`;

  db.query(sql, (err, _) => {
    if (err) throw err;
    res.json({ id, username, fullName, isAdmin });
  });
});

/**
 * API Login user account
 */
app.post("/api/login", async (req: any, response: any) => {
  const { username, password } = req.body;

  let sql = `Select *  From users Where username='${username}'`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    const {
      password: passwordDB,
      username: usernameDB,
      id,
      fullName,
      isAdmin,
    } = res[0];

    bcrypt.compare(password.toString(), passwordDB, (err, result) => {
      if (result && username === usernameDB) {
        const accessToken = generateAccessToken({
          username: usernameDB,
          id,
          fullName,
        });
        const refreshToken = generateRefreshToken({
          username: usernameDB,
          id,
          fullName,
        });
        refreshTokens.push(refreshToken);
        response.json({
          accessToken,
          refreshToken,
          username: usernameDB,
          fullName,
          isAdmin,
        });
      } else {
        response.status(400).json("Username or password incorrect!");
      }
    });
  });
});

/**
 * Refresh token
 */
app.post("/api/refresh-token", (req: any, res: any) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, MY_SECRET_KEY, (err: any, user: any) => {
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
});

/**
 * Verify token
 *
 * @param req
 * @param res
 * @param next
 */
const verify = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, MY_SECRET_KEY, (err: any, user: any) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

/**
 * API Logout
 */
app.post("/api/logout", verify, (req: any, res: any) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token: any) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});

/**
 * API Delete user
 */
app.delete("/api/users/:userId", verify, (req: any, res: any) => {
  if (req.user.id === req.params.userId) {
    let sql = `Delete From users Where id='${req.user.id}'`;

    db.query(sql, (err) => {
      if (err) throw err;
      res.status(200).json("User has been deleted.");
    });
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

/**
 * API update
 */
app.put("/api/users/:usersId", verify, (req: any, res: any) => {
  if (req.params.usersId) {
    let sql = `UPDATE users
    SET fullName = "${req.body.fullName}"
    WHERE id = "${req.params.usersId}"`;

    db.query(sql, (err) => {
      if (err) throw err;
      res.status(200).json("User has been updated.");
    });
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

//-----------ADMIN---------------
/**
 * API get list blogs
 */
app.get("/api/blogs", verify, (req: any, response: any) => {
  const { page = 1, pageSize = 10, sort = "id", filter = "" } = req.query;
  let sql = `Select *  From blogs`;
  let queryParams:any = [];

  db.query(sql, (err, res) => {
    if (err) throw err;

    // Apply filter
    if (filter) {
      sql += ` WHERE name LIKE ?`;
      queryParams.push(`%${filter}%`);
    }

    // Apply sorting
    sql += ` ORDER BY ${sort}`;

    // Apply paging
    const startIndex = (page - 1) * pageSize;
    sql += ` LIMIT ?, ?`;
    queryParams.push(startIndex, pageSize);

    response.status(200).json({ data: res, page, pageSize });
  });
});

/**
 * API add blogs to list
 */
app.post("/api/blogs", verify, (req: any, response: any) => {
  const { title, thumbnail, content } = req.body;
  const id = uuidv4();
  const summary = title;
  let sql = `INSERT INTO blogs VALUE ('${id}', '${title}', '${thumbnail}', '${content}', '${summary}');`;

  db.query(sql, (err, _) => {
    if (err) throw err;
    response.json({ id, title, thumbnail, content, summary });
  });
});

/**
 * API update blogs to list
 */
app.put("/api/blogs/:blogId", verify, (req: any, response: any) => {
  const { title, thumbnail, content, summary } = req.body;
  let sql = `UPDATE blogs
    SET title = "${title}", thumbnail = "${thumbnail}", content = "${content}", summary = "${summary}"
    WHERE id = "${req.params.blogId}"`;

  db.query(sql, (err, _) => {
    if (err) throw err;
    response.json({ title, thumbnail, content, summary });
  });
});

/**
 * API delete blogs in list
 */
app.delete("/api/blogs/:blogId", verify, (req: any, response: any) => {
  if (req.params.blogId) {
    let sql = `Delete From blogs Where id='${req.params.blogId}'`;

    db.query(sql, (err) => {
      if (err) throw err;
      response.status(200).json("Blog has been deleted.");
    });
  } else {
    response.status(403).json("You are not allowed to delete this user!");
  }
});

/**
 * API get detail blog
 */
app.get("/api/blogs/:blogId", verify, (req: any, response: any) => {
  if (req.params.blogId) {
    let sql = `Select * From blogs Where id='${req.params.blogId}'`;

    db.query(sql, (err, res) => {
      if (err) throw err;
      response.status(200).json(res);
    });
  } else {
    response.status(403).json("You are not allowed to delete this user!");
  }
});

app.listen(4000, () => console.log("Backend server is running!"));
