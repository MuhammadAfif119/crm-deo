import { Container, Flex } from "@chakra-ui/react";
import { Fragment } from "react";
// import FooterComponent from "../Components/Footers/FooterComponent";
import HeaderComponent from "../Components/Header/HeaderComponents";
import SidebarComponentV2 from "../Components/Sidebar/SidebarComponentV2";
import SidebarComponentV3 from "../Components/Sidebar/SidebarComponentV3";
import themeConfig from "../Config/themeConfig";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../Pages/Administration/AdminSidebar";

function Layout({ children }) {
  let contentWidth =
    themeConfig.contentWidth === "full" ? "full" : "container.xl";

  const location = useLocation(); 

  const admin = location.pathname.includes("/administration");

  const isFunnelEditPage = location.pathname.includes("/lp-builder");

  return (
    <Fragment>
      <Flex height="100vh" w={"full"} bgColor={"gray.50"}>
        {/* <SidebarComponentV2 layout={themeConfig.layout} /> */}
        {admin ? (
          <AdminSidebar layout={themeConfig.layout} />
        ) : (
          <SidebarComponentV3 layout={themeConfig.layout} />
        )}

        <Container maxW={"full"} overflowY={"scroll"} pt={"4"}>
          <HeaderComponent layout={themeConfig.layout} />

          <Container minH={"95vh"} maxW={contentWidth}>
            {children}
          </Container>

          {/* <FooterComponent /> */}
        </Container>
      </Flex>
    </Fragment>
  );
}

export default Layout;
