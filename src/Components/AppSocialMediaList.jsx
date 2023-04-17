// import React, { useState } from 'react'

// function AppSocialMediaList() {

//     const [socialMediaList, setSocialMediaList] = useState([])



//     const getListSocial = async () => {
//         loadingShow()
//         try {

//             const docRef = doc(db, "users", currentUser.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 setUserData(docSnap.data());
//                 setSocialAccountList(docSnap.data().ayrshare_account);
//                 setSocialMediaList(docSnap.data().social_accounts);
//             } else {
//                 console.log("No such document!");
//             }
//             loadingClose()
//         } catch (error) {
//             console.log(error)
//             loadingClose()
//         }
//     }



//     return (
//         <div>AppSocialMediaList</div>
//     )
// }

// export default AppSocialMediaList