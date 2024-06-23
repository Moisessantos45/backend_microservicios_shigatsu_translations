import * as OTPAuth from "otpauth";

let totp = new OTPAuth.TOTP({
  issuer: "Shigatsu",
  label: "ShigatsuTranslations",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: process.env.SECRET_2FA_KEY_OTPAOUTH,
});

export default totp;
