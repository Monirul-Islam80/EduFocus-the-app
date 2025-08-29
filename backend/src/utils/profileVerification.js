const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const url = `http://10.245.98.37:5000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: '"EduFocus" <no-reply@edufocus.com>',
    to: user.email,
    subject: "Verify your email",
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
      <p style="color: #555;">Hello <strong>${user.name}</strong>,</p>
      <p style="color: #555;">
        Thanks for signing up with <strong>EduFocus</strong> 🎓.  
        Please confirm your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" 
           style="background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #999; font-size: 12px; text-align: center;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="color: #4CAF50; font-size: 12px; text-align: center; word-break: break-all;">
        ${url}
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you didn’t create an account with EduFocus, you can safely ignore this email.
      </p>
    </div>
  </div>
`,
  });
}
module.exports = sendVerificationEmail;
