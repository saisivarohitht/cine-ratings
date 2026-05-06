import nodemailer from 'nodemailer';

const FROM_ADDRESS = process.env.MAIL_FROM || 'CineRatings <no-reply@cine-ratings.local>';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendAuthEmail(options: { to: string; subject: string; text: string; html?: string }) {
  if (!hasSmtpConfig()) {
    console.log('[auth-email]', {
      to: options.to,
      subject: options.subject,
      text: options.text,
    });
    return { sent: false, transport: 'console' as const };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return { sent: true, transport: 'smtp' as const };
}