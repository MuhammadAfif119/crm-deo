import { useState } from "react";


import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/firebase";

function App() {
  const [barStatus, setBarStatus] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(true);
  const contentWidth = barStatus ? "85%" : "95%";
  const height = window.innerHeight;


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
  });

  return (
    <>

     {isLoggedin ? (
        <Layout>
          <MainRouter />
        </Layout>
       ) : (
        <AuthRouter />
       )}
    </>
  );
}

export default App;
