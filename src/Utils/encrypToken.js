import CryptoJS from "crypto-js";
import ErrorToast from "./errorToast";

export const encryptToken = (message) => {
  const secretKey = process.env.REACT_APP_ACCOUNT_KEY;
  if (!secretKey) {
    // Tampilkan toast dengan menggunakan komponen ErrorToast
    return <ErrorToast title="Error" description="Secret key is not available. Please check your configuration." />;
  }

  const token = CryptoJS.AES.encrypt(message, secretKey).toString();

  return token;
};

export const decryptToken = (message) => {
  const secretKey = process.env.REACT_APP_ACCOUNT_KEY;
  if (!secretKey) {
    // Tampilkan toast dengan menggunakan komponen ErrorToast
    return <ErrorToast title="Error" description="Secret key is not available. Please check your configuration." />;
  }

  // Dekripsi pesan
  try {
    var bytes = CryptoJS.AES.decrypt(message, secretKey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    // Tampilkan toast jika terjadi kesalahan saat dekripsi.
    return <ErrorToast title="Error" description="Failed to decrypt the message." />;
  }
};
