
import logokotak from "../assets/kotakputih.png"

const themeConfig = {
  logo: "https://firebasestorage.googleapis.com/v0/b/importir-com.appspot.com/o/1.png?alt=media&token=7eff6537-54e9-454b-a9c7-b5c8f3b05e44",
  logokotak:logokotak,
  layout: {
    type: "vertical", // vertical, horizontal, vertical-horizontal, blank
    navbar: "",
    sidebar: "",
    footer: "",
    userProfile: "sidebar", // sidebar, navbar **choose when using vertical-horizontal type**
  },
  color:{
    colorFirst: "white",
    colorSecond: "#413F42"
  },
  contentWidth: "full", // full, boxed
};

export default themeConfig;
