import apiInstance from "../config/emailConfig.js";

const sendEmail = async (to, subject, html) => {
  try {
    const email = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(email);

    console.log("Email sent:", response.body);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;