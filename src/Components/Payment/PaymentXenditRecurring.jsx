import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import _axios from "../../Api/AxiosBarrier";
import {
  addDocumentFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import { formatFrice } from "../../Utils/Helper";

function PaymentXenditRecurring({
  dataLeads,
  packageActive,
  dataForm,
  membershipList,
}) {
  const [orderId, setOrderId] = useState("");

  const [orderSummary, setOrderSummary] = useState("");

  const [loadingPay, setLoadingPay] = useState(false);

  const [thanksPage, setThanksPage] = useState(false);

  const membershipData = membershipList.find(
    (x) => x.package_code === packageActive
  );

  const toast = useToast({
    position: "top",
    align: "center",
  });

  const sucessOrder = (fixPrice, id) => {
    updateDocumentFirebase("leads", dataLeads.id, {
      status: "open",
      opportunity_value: Number(fixPrice),
      orderId: id,
    })
      .then((res) => {
        setThanksPage(true);
      })
      .catch((err) => console.log(err, "ini err"));
  };

  const handlePaymentTransfer = async (id, updatedOrder, fixPrice) => {
    try {
      setOrderId(id);
      setLoadingPay(true);

      const baseUrl =
        "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/";

      const data = {
        is_production: true,
        package_code: packageActive,
        company_name: dataLeads.name,
        user_name: dataLeads.name,
        user_email: dataLeads.email,
        user_phone: dataLeads.phoneNumber,
        // redirect_url: "https://crm.deoapp.com",
        redirect_url: window.location.href,
      };

      const res = await _axios.post(`${baseUrl}/membershipCreate`, data);

      if (res.status === true) {
        const collectionName = "orders";
        const docName = id;
        const dataUpdetOrder = {
          xendit_recurring_order_id: res?.data?.order_id,
        };

        try {
          const result = await updateDocumentFirebase(
            collectionName,
            docName,
            dataUpdetOrder
          );

          if (result) {
            setLoadingPay(true);

            const dataOrder = {
              order_id: res?.data?.order_id,
            };

            try {
              const resOrder = await _axios.post("/membershipPay", dataOrder);

              if (resOrder.status === true) {
                window.open(resOrder.message.link, "_blank");
              }
              sucessOrder(fixPrice, id);
              setLoadingPay(false);
            } catch (error) {
              console.log(error, "ini error");
              setLoadingPay(false);
            } finally {
              setLoadingPay(false);
            }
          }
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }

        setLoadingPay(false);
      } else {
        console.log(res.data.data);

        toast({
          title: "Warning!",
          description:
            "Terjadi Kesalahan pembayaran, Silahkan menghubungi Admin.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });

        setLoadingPay(false);
      }
    } catch (error) {
      console.log(error, "ini error");

      toast({
        title: "Error!",
        description: "Terjadi Kesalahan, Silahkan menghubungi Admin.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      setLoadingPay(false);
    }

    setLoadingPay(false);
  };

  const handleOrderPayConfirm = async (priceFix) => {
    const fixPrice = priceFix;

    const dataOrder = [
      {
        name: membershipData.package_name,
        price: membershipData.package_amount,
        qty: "1",
        id: membershipData.package_code,
      },
    ];

    const updatedOrder = {
      orders: dataOrder,
      paymentStatus: "open",
      orderStatus: "onProcess",
      paymentMethod: "XENDIT_RECURRING",
      module: "crm",
      category: "membership",
      companyId: dataForm.companyId,
      projectId: dataForm.projectId,
      outletId: dataForm.projectId,
      name: dataLeads.name || "",
      email: dataLeads.email || "",
      phoneNumber: dataLeads.phoneNumber || "",
      amount: Number(priceFix),
      quantity: "1",
      userId: dataLeads.id || "",
    };

    addDocumentFirebase("orders", updatedOrder, dataForm.companyId).then(
      (x) => {
        setOrderSummary(updatedOrder);
        return handlePaymentTransfer(x, updatedOrder, fixPrice);
      }
    );
  };

  if (thanksPage === true) {
    return (
      <Stack>
        <Heading size={"md"}>Thanks for order</Heading>

        {orderSummary && (
          <Stack
            w="full"
            p="4"
            borderColor="gray.300"
            borderWidth={1}
            rounded="md"
            spacing={2}
          >
            <Heading size="sm" mb="2" align="center">
              Order Summary
            </Heading>
            <Flex direction="column">
              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Order Status:</Text>
                <Spacer />
                <Text textAlign="right">Success</Text>
              </HStack>

              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Order ID:</Text>
                <Spacer />
                <Text textAlign="right">{orderId}</Text>
              </HStack>

              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Name :</Text>
                <Spacer />
                <Text textAlign="right">{orderSummary.name}</Text>
              </HStack>

              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Number Phone :</Text>
                <Spacer />
                <Text textAlign="right">{orderSummary.phoneNumber}</Text>
              </HStack>

              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Quantity:</Text>
                <Spacer />
                <Text textAlign="right">{orderSummary.quantity}</Text>
              </HStack>
              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Package Active:</Text>
                <Spacer />
                <Text textAlign="right" textTransform={"capitalize"}>
                  {packageActive}
                </Text>
              </HStack>

              {orderSummary.paymentMethod && (
                <HStack justifyContent="space-between" fontSize="sm" my={1}>
                  <Text fontWeight="bold">Payment Method:</Text>
                  <Spacer />
                  <Text textAlign="right" textTransform={"capitalize"}>
                    {orderSummary.paymentMethod}
                  </Text>
                </HStack>
              )}
              <HStack justifyContent="space-between" fontSize="sm" my={1}>
                <Text fontWeight="bold">Module:</Text>
                <Spacer />
                <Text textAlign="right" textTransform={"uppercase"}>
                  {orderSummary.module}
                </Text>
              </HStack>

              <Divider />
              <HStack justifyContent="space-between" fontSize="sm" my={2}>
                <Text fontWeight="bold">Total Price:</Text>
                <Spacer />
                <Text textAlign="right" fontWeight={700} fontSize={"lg"}>
                  Rp {formatFrice(orderSummary.amount)}
                </Text>
              </HStack>
            </Flex>

            <Flex w="full" py={2}>
              <Button
                w="full"
                borderRadius="lg"
                variant="outline"
                color="green.500"
                shadow="lg"
                borderColor="green.500"
                onClick={() => setThanksPage(false)}
              >
                <Flex
                  flexDir="row"
                  justifyContent="space-bewtween"
                  alignItems="center"
                >
                  {/* <IoMdArrowBack /> */}
                  <Text>Kembali</Text>
                </Flex>
              </Button>
            </Flex>
            <Text fontStyle={"italic"} fontSize="sm" color="red.400">
              *Please screenshot this order summary for this action
            </Text>
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Stack>
        <Heading size={"md"}>Receipent: </Heading>
      </Stack>
      <Stack>
        <HStack justifyContent="space-between" fontSize="sm" my={1}>
          <Text fontWeight="bold">Name :</Text>
          <Spacer />
          <Text textAlign="right">{dataLeads?.name}</Text>
        </HStack>

        <HStack justifyContent="space-between" fontSize="sm" my={1}>
          <Text fontWeight="bold">Number Phone :</Text>
          <Spacer />
          <Text textAlign="right">{dataLeads?.phoneNumber}</Text>
        </HStack>

        <HStack justifyContent="space-between" fontSize="sm" my={1}>
          <Text fontWeight="bold">Email :</Text>
          <Spacer />
          <Text textAlign="right">{dataLeads?.email}</Text>
        </HStack>
      </Stack>
      <Stack>
        <Heading size={"md"}>Payment Recurring: </Heading>
      </Stack>
      <Stack>
        <Stack>
          <HStack>
            <Stack>
              <Text>Amount :</Text>
              <Text fontWeight={500}>
                Rp. {formatFrice(Number(membershipData?.package_amount))}
              </Text>
            </Stack>
            <Spacer />

            <Stack>
              <Text>Duration :</Text>
              <Text fontWeight={500}>
                {" "}
                {membershipData?.package_expired_duration ||
                  membershipData?.package_expired}
              </Text>
            </Stack>
          </HStack>

          <Spacer />

          <Button
            colorScheme="green"
            isLoading={loadingPay}
            onClick={() => handleOrderPayConfirm(membershipData.package_amount)}
          >
            Bayar
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PaymentXenditRecurring;
