import axios from "axios";
import { database } from "../../Config/firebase";
import { ref, set, remove, get, child } from "firebase/database";
import { removeSymbols } from "../../Utils/Helper";

// const getUserIp = async () => {
//   try {
//     const res = await axios.get("https://api.ipify.org?format=json");
//     return String(res.data.ip).replaceAll('.', "");
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const logoutIfExpired = async (hostName, email, pathLink) => {
  try {
    const snapshot = await get(ref(database, `onlineUsers/${removeSymbols(hostName)}-${pathLink}-${removeSymbols(email)}`));
    const userData = snapshot.val();

    if (userData) {
      const currentTime = Date.now();
      const loginTime = new Date(userData.loginTime).getTime(); // Konversi waktu login dari string ke milidetik

      if (currentTime - loginTime > 5 * 60 * 60 * 1000) { // 5 jam dalam milidetik
        await remove(ref(database, `onlineUsers/${removeSymbols(hostName)}-${pathLink}-${removeSymbols(email)}`));
        return true; // Pengguna berhasil logout
      }
    }

    return false; // Pengguna tidak perlu logout
  } catch (error) {
    console.log(error);
    return false;
  }
};




const loginUserWithIp = async (hostName, email, pathLink, uid) => {

  const checkAccess = await checkUserAccess(hostName, email, pathLink)

  if(!checkAccess){
    return false
  }

    try {
      await set(ref(database, `onlineUsers/${removeSymbols(hostName)}-${pathLink}-${removeSymbols(email)}`), {
        loginTime: new Date().toString(),
        email: email,
        uid: uid
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
};

const logoutUserWithIp = async (hostName, email, pathLink) => {

    try {
      await remove(ref(database, `onlineUsers/${removeSymbols(hostName)}-${pathLink}-${removeSymbols(email)}`));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
};

const checkUserAccess = async (hostName, email, pathLink) => {

    try {
      const snapshot = await get(child(ref(database), `onlineUsers/${removeSymbols(hostName)}-${pathLink}-${removeSymbols(email)}`));
      const userData = snapshot.val();
      return userData ? false : true;
    } catch (error) {
      console.log(error);
      return false;
    }
};

export { loginUserWithIp, logoutUserWithIp, checkUserAccess, logoutIfExpired };
