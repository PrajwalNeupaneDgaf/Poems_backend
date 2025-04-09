const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");

// Register Controller
const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });
    if (username.startsWith('@')) {
      throw new Error("Can't use @ as beginning");
    }
    if(username.includes(' ')) throw new Error('UserName Can,t have Space')
    if(password.length<6) throw new Error('Can,t have less than 6 digit in Password')

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword });

    const token = jwt.sign(
        { userId: newUser._id},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

    await newUser.save();
    res.status(201).json({ message: "User registered" ,User:newUser , token:token});
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ User:user,token:token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Me Controller
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  const { query } = req.params; // Get search query from query string

  try {
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }

    // Search users by name or username (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // search by name (case insensitive)
        { username: { $regex: query, $options: "i" } }, // search by username (case insensitive)
      ],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found matching the search query" });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to search users", error: err.message });
  }
};

module.exports = {
  register,
  login,
  me,
  searchUsers
};
