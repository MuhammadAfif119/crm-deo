import { Container, Flex } from "@chakra-ui/react";
import { Fragment } from "react";
// import FooterComponent from "../Components/Footers/FooterComponent";
import HeaderComponent from "../Components/Header/HeaderComponents";
import SidebarComponentV2 from "../Components/Sidebar/SidebarComponentV2";
import themeConfig from "../Config/themeConfig";

function Layout({ children }) {
  let contentWidth =
    themeConfig.contentWidth === "full" ? "full" : "container.xl";


  return (
    <Fragment>
      <Flex height="100vh" w={"full"} bgColor={"gray.50"}>
        <SidebarComponentV2 layout={themeConfig.layout} />

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
