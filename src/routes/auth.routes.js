const express = require("express");
const router = express.Router();

const { register, login, getUserCount } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/user-count", getUserCount);

module.exports = router;
