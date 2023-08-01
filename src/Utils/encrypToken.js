import React from "react";
import CryptoJS from "crypto-js";

export const encryptToken = (message) => {
  const secretKey = process.env.REACT_APP_ACCOUNT_KEY;

  const token = CryptoJS.AES.encrypt(message, secretKey).toString();

  return token;
};

export const decryptToken = (message) => {
  const secretKey = process.env.REACT_APP_ACCOUNT_KEY;

  // Decrypt
  var bytes = CryptoJS.AES.decrypt(message, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);


  return originalText;
};
