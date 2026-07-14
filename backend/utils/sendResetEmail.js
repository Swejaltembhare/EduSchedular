import apiInstance from "../config/emailConfig.js";

export const sendResetEmail = async (user, resetLink) => {
  try {
    const email = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: "Password Reset - EduScheduler",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#4F46E5;">Reset Your Password</h2>

          <p>Dear <strong>${user.name}</strong>,</p>

          <p>Click the button below to reset your password:</p>

          <div style="margin:25px 0;">
            <a href="${resetLink}"
              style="background:#4F46E5;color:#fff;padding:12px 24px;
                     text-decoration:none;border-radius:5px;display:inline-block;">
              Reset Password
            </a>
          </div>

          <p>Or copy this link:</p>

          <p style="background:#f4f4f4;padding:10px;border-radius:5px;">
            ${resetLink}
          </p>

          <p><strong>Note:</strong> This link expires in 1 hour.</p>
        </div>
      `,
    };

    const response = await apiInstance.sendTransacEmail(email);

    console.log("Reset email sent:", response.body);

    return {
      success: true,
      data: response.body,
    };
  } catch (error) {
    console.error("Reset email error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};