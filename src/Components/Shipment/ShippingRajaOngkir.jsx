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

const courierList = ["jne", "anteraja", "tiki", "sicepat", "wahana", "jnt"];

const ShippingRajaOngkir = ({
  setFullAddress,
  setSelectedCourier,
  selectedCourier,
  setSelectedDestination,
  selectedDestination,
  selectedService,
  setSelectedService,
  selectedSubdistrict,
  setSelectedSubdistirct,
  weight,
}) => {
  const [destinationResults, setDestinationResults] = useState([]);

  const [cityDestination, setCityDestination] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [subdistricts, setSubdistricts] = useState([]);
  //   const [selectedSubdistrict, setSelectedSubdistirct] = useState();

  //   const [selectedService, setSelectedService] = useState();
  const [shipmentService, setShipmentService] = useState([]);

  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [priceSuggestions, setPriceSuggestions] = useState({});
  const [fetchingDestinations, setFetchingDestinations] = useState(false);

  const getDestination = async () => {
    setFetchingDestinations(true);
    try {
      const result = await axios.get(
        "https://us-central1-intrapreneuer.cloudfunctions.net/listprovince"
      );

      if (
        result.data?.rajaongkir?.results !== undefined &&
        result.data?.rajaongkir?.results?.length > 0
      ) {
        setDestinationResults(result.data?.rajaongkir?.results);
      }
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingDestinations(false);
    }
  };

  const getDataCities = async () => {
    const requestData = { province_id: selectedDestination.province_id }; // Use 'province_id' here

    try {
      const result = await axios.get(
        `https://us-central1-intrapreneuer.cloudfunctions.net/listcities?province=${requestData.province_id}`,
        requestData
      );
      setCityDestination(result.data?.rajaongkir?.results);
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingDestinations(false);
    }
  };

  const getDataSubcities = async () => {
    const parseDataCity = JSON.parse(selectedCity);
    const requestData = { city_id: parseDataCity.city_id }; // Use 'province_id' here

    try {
      const result = await axios.get(
        `https://us-central1-intrapreneuer.cloudfunctions.net/listsubdistrict?city=${requestData.city_id}`,
        requestData
      );
      setSubdistricts(result.data?.rajaongkir?.results);
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingDestinations(false);
    }
  };

  const getDataCost = async (courier) => {
    setSelectedCourier(courier);

    const parseDataSubdistrict = JSON.parse(selectedSubdistrict);

    const payload = {
      origin: 6301,
      originType: "subdistrict",
      destination: parseInt(parseDataSubdistrict.subdistrict_id),
      destinationType: "subdistrict",
      weight: weight,
      courier: courier,
    };

    const config = {
      method: "post",
      url: "https://us-central1-intrapreneuer.cloudfunctions.net/costrajaongkir",
      data: payload,
    };

    setFetchingPrice(true);
    try {
      const result = await axios(config);
      setShipmentService(result?.data?.message?.rajaongkir?.results);
    } catch (error) {
      console.log(error, "error getting destination");
    } finally {
      setFetchingPrice(false);
    }
  };

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
    if (selectedCity === null) {
    } else {
      getDataSubcities();
    }

    return () => {};
  }, [selectedCity]);

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

  return (
    <Box w={"full"}>
      <Text>Dikirim dari :</Text>
      <Text fontWeight="bold">Tangerang</Text>

      <Stack gap={3}>
        <Text fontWeight="bold" mt={3}>
          {" "}
          Silakan Isi Alamatmu:
        </Text>

        <Stack>
          <Text>Alamat Lengkap:</Text>
          <Textarea
            placeholder="Jl. Wana Kencana blok J1/10, Tangerang Selatan"
            onChange={(e) => setFullAddress(e.target.value)}
          />
        </Stack>

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
      </Stack>
      <Stack my={2}>
        <Select
          placeholder="Pilih Kota"
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cityDestination?.map((x) => (
            <option value={JSON.stringify(x)}>{x.city_name}</option>
          ))}
        </Select>
      </Stack>
      <Stack my={2}>
        <Select
          placeholder="Pilih Kecamatan"
          onChange={(e) => setSelectedSubdistirct(e.target.value)}
        >
          {subdistricts?.map((x) => (
            <option value={JSON.stringify(x)}>{x.subdistrict_name}</option>
          ))}
        </Select>
      </Stack>

      <Stack my={2}>
        <Select
          placeholder="Pilih Kurir"
          onChange={(e) => getDataCost(e.target.value)}
        >
          {courierList?.map((x, i) => (
            <option key={i} value={x}>
              <Text textTransform={"uppercase"}>{x}</Text>
            </option>
          ))}
        </Select>
      </Stack>

      {fetchingPrice ? (
        <Center my={5}>
          <Spinner color="gray.500" />
        </Center>
      ) : shipmentService?.length > 0 ? (
        shipmentService[0].costs?.map((x, i) => (
          <Flex
            cursor="pointer"
            _hover={{
              bg: "gray.200",
            }}
            _active={{
              bg: "gray.300",
            }}
            bg={selectedService?.service === x?.service ? "gray.100" : "white"}
            justifyContent="space-between"
            borderBottomWidth={1}
            gap={2}
            key={i}
            p={1}
            onClick={() => {
              // requestOrderJne(x)
              setSelectedService(x);
            }}
          >
            <Stack>
              <Text>
                <strong>{x?.service}</strong>{" "}
                <i style={{ color: "gray", fontSize: 12 }}>
                  ({x?.description})
                </i>
              </Text>
              <Text fontSize={12} color="gray.600">
                Estimasi {x?.cost[0]?.etd} hari
              </Text>
            </Stack>
            <Stack alignItems="flex-end">
              <Text fontWeight={"bold"}>
                Rp {formatFrice(parseInt(x?.cost[0]?.value))}
              </Text>
              {selectedService?.service === x?.service ? (
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
