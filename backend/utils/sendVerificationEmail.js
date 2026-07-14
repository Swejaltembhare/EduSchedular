import apiInstance from "../config/emailConfig.js";

export const sendVerificationEmail = async (user, verificationLink) => {
  console.log("Email function called");

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
      subject: "Verify Your Email - EduScheduler",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Welcome to EduScheduler! 🎓</h2>
            </div>

            <div style="padding: 30px; color: #333;">
              <p>Dear <strong>${user.name}</strong>,</p>

              <p>
                Thank you for registering with EduScheduler!
                Please verify your email address to complete your registration.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${verificationLink}"
                  style="background:#4F46E5;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
                  Verify Email Address
                </a>
              </div>

              <p>Or copy this link:</p>

              <p style="background:#f4f4f4;padding:10px;border-radius:5px;">
                ${verificationLink}
              </p>

              <p><strong>Note:</strong> This link expires in 24 hours.</p>

              <hr>

              <p style="font-size:12px;color:#777;">
                If you didn't create this account, ignore this email.
              </p>
            </div>

            <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777;">
              EduScheduler - Smart Timetable Management System
            </div>

          </div>
        </div>
      `,
    };

    const response = await apiInstance.sendTransacEmail(email);

    console.log("Verification email sent:", response.body);

    return {
      success: true,
      data: response.body,
    };
  } catch (error) {
    console.error("Verification email error:", error);

    throw error;
  }
};