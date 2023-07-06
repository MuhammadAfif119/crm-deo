import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, HStack, IconButton, SimpleGrid, Divider, AbsoluteCenter } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import { deleteDocumentFirebase, getSingleDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Routes/Store';

const ViewPageListing = () => {
  const [categoryData, setCategoryData] = useState({});
  const [categoryModule, setCategoryModules] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const { userDisplay } = useUserStore();

  const projectId = userDisplay.currentProject



  // const companyId = userDisplay.currentProject;


  const getData = async () => {

    try {
      const q = query(collection(db, 'listings'), 
      where("projectId", "==", projectId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData });
        });


        const mappedData = {};
        data.forEach((listing) => {
          const categories = listing.category;
          categories.forEach((category) => {
            if (!mappedData[category]) {
              mappedData[category] = [];
            }
            mappedData[category].push(listing);
          });
        });

        setCategoryData((prevData) => ({ ...prevData, ...mappedData }));
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, 'ini error');
    }
  };

  const handleCategory = async (value) => {
    try {
      const result = await getSingleDocumentFirebase(`categories/${projectId}/${value}`, 'data');
      setCategoryList(result);
      setSelectedCategory(value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryFilter = async (value) => {
    try {
      const q = query(collection(db, 'listings'), 
      where("category", "array-contains", value),
      where("projectId", "==", projectId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData });
        });

        const mappedData = {};
        data.forEach((listing) => {
          const categories = listing.category;
          categories.forEach((category) => {
            if (!mappedData[category]) {
              mappedData[category] = [];
            }
            mappedData[category].push(listing);
          });
        });

        setCategoryData(mappedData);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, 'ini error');
    }
  };


  const getDataCategory = async () => {
    try {
      const unsubscribe = onSnapshot(doc(db, "categories", projectId), (docCat) => {
        setCategoryModules({ id: docCat.id, ...docCat.data() });
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {
    getData();
    getDataCategory();
  }, [userDisplay.currentProject]);

  const handleDelete = async (listing) => {
    const collectionName = 'listings';
    const docName = listing.id;

    try {
      const result = await deleteDocumentFirebase(collectionName, docName);
      console.log(result); // Pesan toast yang berhasil
      console.log('berhasil menghapus');
    } catch (error) {
      console.log('Terjadi kesalahan:', error);
    }
  };

  return (
    <Box>
      <Stack>
        {categoryModule?.data?.length > 0 && (
          <HStack>
            {categoryModule?.data?.map((x, index) => (
              <Text
                key={index}
                onClick={() => handleCategory(x)}
                fontWeight={selectedCategory === x ? 'bold' : 'normal'}
              >
                {x}
              </Text>
            ))}
          </HStack>
        )}

        {categoryList && (
          <HStack>
            {categoryList?.category?.map((x, index) => (
              <Text
                key={index}
                onClick={() => handleCategoryFilter(x)}
                fontWeight={selectedCategory === x ? 'bold' : 'normal'}
              >
                {x}
              </Text>
            ))}
          </HStack>
        )}
      </Stack>
      {Object.entries(categoryData).map(([category, categoryListing]) => (
        <Stack spacing={2} key={category} py={2}>
          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter bg="black" borderRadius="md" p="2">
              <Text fontWeight={500} fontSize={23} color="white">
                {category?.toUpperCase()}
              </Text>
            </AbsoluteCenter>
          </Box>
          <SimpleGrid columns={[1, 2, 3]} gap={5}>
            {categoryListing?.map((listing, index) => (
              <Stack mb={2} key={index}>
                {listing.image && (
                  <Box flex="1">
                    <img src={listing.image} alt={listing.title} />
                  </Box>
                )}
                <Box flex="1">
                  <Text fontWeight="bold">{listing.title}</Text>
                  <Text>{listing.description}</Text>
                  <Text>{listing.price}</Text>
                  <Text>Contact Person: {listing.contactPerson}</Text>
                  <Text>Details:</Text>
                  {listing?.details?.map((detail, index) => (
                    <HStack key={index} spacing={2} alignItems="center">
                      <Text fontWeight="bold">{detail.key}:</Text>
                      <Text>{detail.value}</Text>
                    </HStack>
                  ))}
                  <Text>Project Name: {listing.projectName}</Text>
                </Box>
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Delete Listing"
                  onClick={() => handleDelete(listing)}
                />
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Box>
  );
};

export default ViewPageListing;