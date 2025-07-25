export const resetPasswordTemp = (name, resetCode) =>
	`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">Verify Your Email</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>Hello ${name},</p>
      <p>Thank you for signing up! Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0">
        <span
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #8066ea;
          "
          >${resetCode}</span
        >
      </div>
      <p>
        Enter this code on the verification page to complete your registration.
      </p>
      <p>This code will expire in 10 minutes for security reasons.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br />Tawjihi support</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;

export const acceptTeacherTemp = (name) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">Verify Your Email</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>Hello ${name},</p>
      <p>we have accepted you to join us as a teacher you can login now using your email and password</p>  
      <p>
      <p>Best regards,<br />Tawjihi support</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;

export const refuseTeacherTemp = (name, isActive) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">Verify Your Email</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>Hello ${name},</p>
      <p>
        ${isActive ? 'Unlucky we will refuse you as teacher' : 'Unlucky we could not accept you to join us as a teacher, strength your cv and try to join us later'}
      </p>  
      <p>
      <p>Best regards,<br />Tawjihi support</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;
