const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, name, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'PumP <noreply@pump-fitness.com>',
      to: email,
      subject: '🔐 Your PumP Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Arial', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 40px auto; background: #111; border-radius: 16px; overflow: hidden; border: 1px solid #222; }
            .header { background: linear-gradient(135deg, #ff6b35, #ff4500); padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 4px; }
            .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
            .body { padding: 40px; text-align: center; }
            .greeting { font-size: 18px; margin-bottom: 24px; color: #ccc; }
            .otp-box { background: #1a1a1a; border: 2px solid #ff6b35; border-radius: 12px; padding: 24px; margin: 24px 0; }
            .otp { font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #ff6b35; }
            .note { color: #888; font-size: 13px; margin-top: 24px; }
            .footer { background: #0a0a0a; padding: 20px; text-align: center; color: #555; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://raw.githubusercontent.com/Yuval2306/PumP/main/frontend/public/PumP_logo.png" alt="PumP" style="height: 100px; object-fit: contain;" />
            </div>
            <div class="body">
              <p class="greeting">Hey ${name}! 💪</p>
              <p style="color:#ccc;">Your verification code is:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p class="note">This code expires in 10 minutes. Don't share it with anyone.</p>
            </div>
            <div class="footer">© 2024 PumP Fitness. All rights reserved.</div>
          </div>
        </body>
        </html>
      `
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Email error:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendOTPEmail };