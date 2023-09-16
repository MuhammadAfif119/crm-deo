import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Shipping from "../../Components/Shipment/Shipping";

const ShippingPaymentPage = () => {
  const [selectedCourier, setSelectedCourier] = useState();
  const [selectedDestination, setSelectedDestination] = useState({});
  const [fullAddres, setFullAddress] = useState("");

  const [data, setData] = useState({
    email: "",
    phone: "",
    shipping: "",
  });

  return (
    <Box>
      <Box bg={"white"} p={5}>
        <FormControl>
          <Stack>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder={"Email"}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </Stack>

          <Stack>
            <FormLabel>
              Phone Number {"("}Whatsapp Active{")"}
            </FormLabel>
            <Input
              placeholder={"Phone number"}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </Stack>

          <Stack>
            <FormLabel>Shipping</FormLabel>
            <Select>
              <option>Shipment</option>
              <option>Shipment</option>
            </Select>
          </Stack>

          <Shipping
            my={3}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            selectedCourier={selectedCourier}
            setSelectedCourier={setSelectedCourier}
            setFullAddress={setFullAddress}
          />
        </FormControl>

        <Box mt={3}>
          <Button onClick={() => console.log("submit")}>Submit</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShippingPaymentPage;
