import { transporter } from '../config/mailer.js';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (payload: ContactPayload) => {
  const mailOptions = {
    from: `"${payload.name}" <${process.env.SMTP_USER}>`,
    replyTo: payload.email,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    subject: `[Portfolio Contact] ${payload.subject}`,
    html: `
      <h3>Pesan Baru dari Web Portofolio</h3>
      <p><strong>Nama:</strong> ${payload.name}</p>
      <p><strong>Email Pengirim:</strong> ${payload.email}</p>
      <p><strong>Subjek:</strong> ${payload.subject}</p>
      <hr />
      <p><strong>Pesan:</strong></p>
      <p style="white-space: pre-wrap;">${payload.message}</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};