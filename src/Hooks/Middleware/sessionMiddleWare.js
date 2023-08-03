import axios from "axios";
import { database } from "../../Config/firebase";
import { ref, set, remove, get, child } from "firebase/database";
import { encryptToken } from "../../Utils/encrypToken";

// const getUserIp = async () => {
//   try {
//     const res = await axios.get("https://api.ipify.org?format=json");
//     return String(res.data.ip).replaceAll('.', "");
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const loginUserWithIp = async (uid, pathLink) => {
//   const userIp = await getUserIp();

  const checkAccess = await checkUserAccess(uid, pathLink)

  if(checkAccess){
    return false
  }

//   if (userIp) {
    try {
      await set(ref(database, `onlineUsers/${pathLink}-${uid}`), {
        loginTime: new Date().toString(),
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
//   } 
//   else {
//     return false;
//   }
};

const logoutUserWithIp = async (uid, pathLink) => {
//   const userIp = await getUserIp();
//   if (userIp) {
    try {
      await remove(ref(database, `onlineUsers/${pathLink}-${uid}`));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
//   } else {
//     return false;
//   }
};

const checkUserAccess = async (uid, pathLink) => {
//   const userIp = await getUserIp();
//   if (userIp) {
    try {
      const snapshot = await get(child(ref(database), `onlineUsers/${pathLink}-${uid}`));
      const userData = snapshot.val();
      return userData ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
//   } else {
//     return false;
//   }
};

export { loginUserWithIp, logoutUserWithIp, checkUserAccess };
