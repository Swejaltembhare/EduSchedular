import transporter from '../config/emailConfig.js';
import getSuggestionEmailTemplate from '../utils/emailTemplates.js';

export const sendAdminNotification = async (suggestionData) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Suggestion: ${suggestionData.category || 'General'} - ${new Date().toLocaleDateString()}`,
            html: getSuggestionEmailTemplate(suggestionData)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email: ', error);
        return { success: false, error: error.message };
    }
};



export const sendBulkEmail = async (emails, subject, message) => {
  try {
    const mailOptions = {
      from: `"Admin - EduScheduler" <${process.env.EMAIL_USER}>`,
      bcc : emails,
      subject,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email error:", error);
  }
};

export default { sendAdminNotification };