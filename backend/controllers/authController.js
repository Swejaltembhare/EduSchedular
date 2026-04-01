import User from "../models/User.js";
import validator from "validator";

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      semester: user.semester,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, semester, adminKey } =
      req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 3 characters",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!email.endsWith("@college.edu") && !email.endsWith("@gmail.com")) {
      return res.status(400).json({
        success: false,
        message: "Use college or Gmail email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Validate role
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'admin' or 'user'",
      });
    }

    const ADMIN_SECRET = process.env.ADMIN_SECRET;

    let finalRole = "user";

    if (role === "admin") {
      if (!adminKey || adminKey !== ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin key",
        });
      }
      finalRole = "admin";
    }

    // Department and semester validation - ONLY for user role
    if (finalRole === "user") {
      if (!department || department === "") {
        return res.status(400).json({
          success: false,
          message: "Select a valid department",
        });
      }

      if (!semester || semester === "") {
        return res.status(400).json({
          success: false,
          message: "Select a valid semester",
        });
      }
    }

    // For admin, set default values
    const userDepartment = finalRole === "user" ? department : undefined;
    const userSemester = finalRole === "user" ? semester : undefined;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: finalRole, // 🔥 IMPORTANT CHANGE
      department: userDepartment,
      semester: userSemester,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    if (
      !normalizedEmail.endsWith("@college.edu") &&
      !normalizedEmail.endsWith("@gmail.com")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only college or Gmail allowed",
      });
    }

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
      isActive: true,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ================= GET ME =================
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email required",
    });
  }

  res.status(200).json({
    success: true,
    message: "If account exists, reset link sent",
  });
};
