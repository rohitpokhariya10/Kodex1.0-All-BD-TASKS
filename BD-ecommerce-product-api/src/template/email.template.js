const templateEmail = (docs)=>{
return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Registration Successful</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fb; padding:32px 12px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 14px 40px rgba(15, 23, 42, 0.12);">
                  <tr>
                    <td style="background:linear-gradient(135deg, #2563eb, #14b8a6); padding:36px 28px; text-align:center;">
                      <h1 style="margin:0; color:#ffffff; font-size:28px; line-height:1.3; font-weight:700;">
                        Welcome to Our Platform
                      </h1>
                      <p style="margin:10px 0 0; color:#dbeafe; font-size:15px;">
                        Your registration was completed successfully.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:34px 30px 12px;">
                      <h2 style="margin:0 0 14px; color:#111827; font-size:22px; line-height:1.35;">
                        Hi ${docs.name},
                      </h2>
                      <p style="margin:0 0 18px; color:#4b5563; font-size:16px; line-height:1.7;">
                        Thanks for creating your account. You can now explore products, manage your profile, and enjoy a smoother shopping experience.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0; background-color:#f8fafc; border:1px solid #e5e7eb; border-radius:12px;">
                        <tr>
                          <td style="padding:18px 20px;">
                            <p style="margin:0 0 6px; color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                              Registered Email
                            </p>
                            <p style="margin:0; color:#111827; font-size:16px; font-weight:600;">
                              ${docs.email}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 24px; color:#4b5563; font-size:15px; line-height:1.7;">
                        We are happy to have you here. Your account is ready to use.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 30px 34px;">
                      <div style="height:1px; background-color:#e5e7eb; margin-bottom:22px;"></div>
                      <p style="margin:0; color:#9ca3af; font-size:13px; line-height:1.6; text-align:center;">
                        This email was sent because a new account was registered with this email address.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`
}

module.exports = templateEmail;