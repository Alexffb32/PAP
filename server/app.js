const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/authRouter");
const profileRouter = require("./routers/profileRouter");
const chatRoomRouter = require("./routers/chatRoomRouter");
const contactsRouter = require("./routers/contactsRouter");
const uploadRouter = require("./routers/uploadRouter");

const errorController = require("./controllers/errorController");
const ReqError = require("./utilities/ReqError");

const app = express();

// Enable CORS and cookie parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount API routers
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chatrooms", chatRoomRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/upload", uploadRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ReqError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global error handling middleware
app.use(errorController);

module.exports = app;