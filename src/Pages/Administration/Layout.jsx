import { Container, Flex } from "@chakra-ui/react";
import { Fragment } from "react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {

  return (
    <Fragment>
      <Flex height="100vh" w={"full"} bgColor={"gray.50"}>
        <AdminSidebar />

          <Container>
            {children}
          </Container>

      </Flex>
    </Fragment>
  );
}

export default AdminLayout;
