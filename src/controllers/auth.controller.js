const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }
    const newUser = await User.create({ username, password, role });
    const token = generateToken(newUser);
    res.status(201).json({ message: "Usuario registrado correctamente", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Usuario o contraseña inválidos" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuario o contraseña inválidos" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error al contar usuarios", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserCount,
};
