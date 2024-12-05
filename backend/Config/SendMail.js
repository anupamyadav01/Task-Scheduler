import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Creates and configures the Nodemailer transporter using environment variables.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email with the specified details.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text content of the email.
 * @param {string} [html] - Optional HTML content for the email.
 * @returns {Promise<Object>} - Resolves with the email response if successful.
 */
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }), // Include HTML content if provided
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to}:`, info);
    return info; // Return email sending response
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw new Error("Email sending failed. Please try again.");
  }
};
