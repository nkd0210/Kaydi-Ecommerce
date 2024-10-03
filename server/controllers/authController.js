import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(401).json({ message: "All fields are required" });
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(401).json({ message: "All fields are required" });
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const { password: past, ...rest } = validUser._doc;

    const isProduction = process.env.NODE_ENV === "production";

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction, // // true trong production, false trong localhost
        sameSite: isProduction ? "None" : "Lax", // SameSite=None only in production
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction, // // true trong production, false trong localhost
        sameSite: isProduction ? "None" : "Lax", // SameSite=None only in production
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .json({
        message: "User signed out successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, photo } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePic: photo,
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          username: newUser.username,
          isAdmin: newUser.isAdmin,
        },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(403).json({ message: "Refresh token is missing" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Token refreshed successfully" });
  });
};
