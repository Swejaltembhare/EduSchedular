const User = require('../models/User');
const { generateRandomPassword } = require('../utils/helpers');


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE PROFILE (Updated version)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Get updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ✅ CHANGE PASSWORD (Already exists, keep as is)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE PREFERENCES (Already exists, keep as is)
exports.updatePreferences = async (req, res, next) => {
  try {
    const { notifications, theme, language } = req.body;

    const updateFields = {};
    
    if (notifications !== undefined) {
      updateFields['preferences.notifications'] = notifications;
    }
    
    if (theme) {
      updateFields['preferences.theme'] = theme;
    }
    
    if (language) {
      updateFields['preferences.language'] = language;
    }

    // Check if any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one preference to update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Remove faculty related code since we don't need it
// In the existing functions, remove faculty checks

// In getUser function, remove faculty check
exports.getUser = async (req, res, next) => {
  try {
    let user;
    
    // If ID is provided, get that user (admin only)
    if (req.params.id) {
      user = await User.findById(req.params.id).select('-password');
    } else {
      // Get current user (from profile route)
      user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// In createUser function, remove faculty creation
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, department, semester, sendWelcomeEmail = true, ...otherData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate random password if not provided
    let password = req.body.password;
    if (!password) {
      password = generateRandomPassword();
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "admin" or "user"'
      });
    }

    // For user role, department and semester are required
    if (role === 'user') {
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department is required for user role'
        });
      }
      if (!semester) {
        return res.status(400).json({
          success: false,
          message: 'Semester is required for user role'
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department: role === 'user' ? department : 'Administration',
      semester: role === 'user' ? semester : 'N/A',
      ...otherData
    });

    // Send welcome email if requested
    if (sendWelcomeEmail) {
      try {
        // You can implement email service later
        console.log(`Welcome email would be sent to: ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue even if email fails
      }
    }

    // Get user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: userResponse,
      message: sendWelcomeEmail ? 'User created successfully. Welcome email sent.' : 'User created successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// In updateUser function, remove faculty update
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating password through this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// In deleteUser function, remove faculty deactivation
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
