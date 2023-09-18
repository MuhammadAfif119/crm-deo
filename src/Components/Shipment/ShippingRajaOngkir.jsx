import {
  Box,
  Center,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { formatFrice } from "../../Utils/numberUtil";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { provinceList } from "../../Api/shippingApi";

const ShippingRajaOngkir = ({
  setFullAddress,
  setSelectedCourier,
  selectedCourier,
  setSelectedDestination,
  selectedDestination,
}) => {
  const [destinationResults, setDestinationResults] = useState([]);
  const [cityDestination, setCityDestination] = useState([]);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [priceSuggestions, setPriceSuggestions] = useState({});
  const [fetchingDestinations, setFetchingDestinations] = useState(false);

  const getDestination = async () => {
    setFetchingDestinations(true);
    try {
      const result = await axios.get("http://localhost:5000/listProvince");
      console.log(result.data?.rajaongkir?.results);

      if (
        result.data?.rajaongkir?.results !== undefined &&
        result.data?.rajaongkir?.results?.length > 0
      ) {
        setDestinationResults(result.data?.rajaongkir?.results);
        console.log(result);
      }
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingDestinations(false);
    }
  };

  const getDataCities = async () => {
    try {
      const result = await axios.get("http://localhost:5000/listCities", {
        params: { province_id: selectedDestination.province_id },
      });
      console.log(result.data?.rajaongkir?.results);
      setCityDestination(result.data?.rajaongkir?.results);
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingDestinations(false);
    }
  };

  console.log(cityDestination, "ini city");

  const handleDestinationSearch = (value) => {
    setDestinationSearch(value);
  };

  const getPricing = async () => {
    setFetchingPrice(true);
    const url = "https://getpricing-qwuyxef5gq-uc.a.run.app";
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      withCredentials: false,
      url: url,
      data: {
        username: "DBRAND",
        api_key: "e34a6683064f208340e6b8e683c7163f",
        is_production: true,
        from: "CGK10000",
        thru: selectedDestination?.City_Code,
        weight: 1,
      },
    };
    try {
      const result = await axios(config);
      if (result?.data?.data !== undefined && result?.data?.data?.length > 0) {
        setPriceSuggestions(result);
      }
    } catch (error) {
      console.log(error.response.data, "error getting price");
    } finally {
      setFetchingPrice(false);
    }
  };

  useEffect(() => {
    getDestination();

    return () => {};
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const found = destinationResults.filter((elem) => {
        return (
          JSON.stringify(elem)
            .toLowerCase()
            .indexOf(destinationSearch.toLowerCase()) !== -1
        );
      });

      if (destinationSearch?.length !== 0) {
        setDestinationSuggestions(found);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [destinationSearch]);

  useEffect(() => {
    if (Object.keys(selectedDestination).length !== 0) getDataCities();
    // getPricing();
    return () => {};
  }, [selectedDestination]);

  console.log(selectedDestination, "ini destination");

  return (
    <Box w="md">
      <Text>Dikirim dari :</Text>
      <Text fontWeight="bold">Jakarta Selatan</Text>

      <Stack gap={3}>
        <Text fontWeight="bold" mt={3}>
          {" "}
          Silakan Isi Alamatmu:
        </Text>
        <InputGroup>
          <Input
            value={
              Object.keys(selectedDestination).length > 0
                ? selectedDestination?.province
                : destinationSearch
            }
            placeholder={
              fetchingDestinations ? "Loading..." : "Kota / Kabupaten Tujuan"
            }
            onChange={(e) => handleDestinationSearch(e.target.value)}
            isDisabled={fetchingDestinations}
          />
          <InputRightElement
            _hover={{
              bg: "gray.200",
            }}
            cursor="pointer"
            onClick={() => {
              setSelectedDestination({});
              setDestinationSearch("");
              setDestinationSuggestions([]);
            }}
          >
            <Icon as={AiOutlineClose} />
          </InputRightElement>
        </InputGroup>
        {destinationSuggestions.length > 0 &&
          Object.entries(selectedDestination).length === 0 && (
            <List bg="gray.50" mt={-3}>
              {destinationSuggestions.map((suggestion, index) => (
                <ListItem
                  onClick={() => {
                    // console.log(suggestion)
                    setSelectedDestination(suggestion);
                  }}
                  borderBottomWidth={1}
                  p={2}
                  cursor="pointer"
                  _hover={{
                    backgroundColor: "gray.200",
                  }}
                  key={index}
                >
                  <strong>{suggestion?.province}</strong>
                </ListItem>
              ))}
            </List>
          )}
        {/* {destinationSuggestions?.length === 0 && destinationSearch?.length !== 0 && 
                              <Text color="gray.800">
                                  <i>Kota / kecamatan tidak ditemukan.</i>
                              </Text>
                          } */}
      </Stack>
      <Stack my={2}>
        <Select placeholder="Pilih Kota">
          {cityDestination?.map((x) => (
            <option value={x}>{x.city_name}</option>
          ))}
        </Select>
      </Stack>
      <Stack>
        <Text>Alamat Lengkap:</Text>
        <Textarea
          placeholder="Jl. Wana Kencana blok J1/10, Tangerang Selatan"
          onChange={(e) => setFullAddress(e.target.value)}
        />
      </Stack>

      {fetchingPrice ? (
        <Center my={5}>
          <Spinner color="gray.500" />
        </Center>
      ) : priceSuggestions?.data?.data?.length > 0 ? (
        priceSuggestions?.data?.data
          ?.sort((a, b) => parseInt(a.price) - parseInt(b.price))
          .map((x, i) => (
            <Flex
              cursor="pointer"
              _hover={{
                bg: "gray.200",
              }}
              _active={{
                bg: "gray.300",
              }}
              bg={
                selectedCourier?.service_code === x?.service_code
                  ? "gray.100"
                  : "white"
              }
              justifyContent="space-between"
              borderBottomWidth={1}
              gap={2}
              key={i}
              p={1}
              onClick={() => {
                // requestOrderJne(x)
                setSelectedCourier(x);
              }}
            >
              <Stack>
                <Text>
                  <strong>{x?.service_display}</strong>{" "}
                  <i style={{ color: "gray", fontSize: 12 }}>
                    ({x?.goods_type})
                  </i>
                </Text>
                <Text fontSize={12} color="gray.600">
                  Estimasi{" "}
                  {x?.etd_from !== x?.etd_thru
                    ? x?.etd_from + "-" + x?.etd_thru
                    : x?.etd_from}
                  {x?.times === "D" && " hari"}
                </Text>
              </Stack>
              <Stack alignItems="flex-end">
                <Text fontWeight={"bold"}>
                  {x?.currency} {formatFrice(parseInt(x?.price))}
                </Text>
                {selectedCourier?.service_code === x?.service_code ? (
                  <Icon as={FcCheckmark} />
                ) : (
                  <></>
                )}
              </Stack>
            </Flex>
          ))
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ShippingRajaOngkir;
