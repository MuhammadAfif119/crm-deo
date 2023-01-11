import { Box, Button, Center, Heading, HStack, Image, SimpleGrid, Spacer, Spinner, Stack, Tag, Text, useToast } from '@chakra-ui/react'
import { arrayRemove, doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Config/firebase';
import { AiFillStar, AiOutlineDelete } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import AuthContext from '../Routes/hooks/AuthContext';
import { formatFrice } from '../Utils/Helper'
import colors from '../Utils/colors';
import { HiOutlineHeart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function FavoritePage() {


  const { currentUser, productListWishlist } = useContext(AuthContext)

  const toast = useToast()

  const navigate = useNavigate()
  const height = window.innerHeight


  const handleDelete = async (item) => {
    let firebaseData = {}
    firebaseData = { ...item }

    try {

      const ref = doc(db, "wishlist", currentUser.uid);
      await setDoc(ref, {
        uid: currentUser.uid,
        data: arrayRemove(firebaseData),
        createdAt: new Date()
      }, { merge: true });

      firebaseData = {}
      toast({
        title: 'BELANJA.ID',
        description: 'Berhasil menghapus produk dari wishlist.',
        status: 'success'
      })
    } catch (error) {
      toast({
        title: 'BELANJA.ID',
        description: error.message,
        status: 'error'
      })
    }
  }


  const handleOrder = (flag, id) => {
    if (flag === null) {
      navigate(`/productlive/${id}`)
    }
    if (flag) {
      navigate(`/product/${flag}/${id}`)
    }
  }


  return (
    <Stack bgColor={'gray.100'} py={5} h={height}>

      {productListWishlist?.data?.length > 0 ? (
        <SimpleGrid columns={2} gap={5} mx={5}>
          {
            productListWishlist?.data?.map((x, i) =>
              <Stack shadow='md' key={i} borderRadius={'xl'} spacing={2} bgColor='white' >
                <Stack alignItems={'center'} >
                  <Image src={x.image} alt='img' borderRadius={'md'} />
                </Stack>
                <Stack px={3}>
                  <Text textTransform={'capitalize'} fontWeight='bold' fontSize={'sm'} noOfLines={2}> {x.title_en}</Text>
                </Stack>


                <SimpleGrid columns={[1, 2, 2]} alignItems={'flex-end'} px={4} spacing={0}>
                  <Stack spacing={0}>
                    <Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.600'} fontSize={'sm'}>harga</Text>
                    <Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.00'} fontSize={'md'}>Rp. {formatFrice(x.price_idr_markup)}</Text>
                  </Stack>

                  <Stack alignItems={'flex-end'} justifyContent='center'>
                    <HStack>
                      <Stack>
                        <Tag>CN 🇨🇳</Tag>
                      </Stack>
                      <Stack cursor={'pointer'} onClick={() => handleDelete(x)}>
                        <AiOutlineDelete
                          style={{ fontSize: 20, color: 'red', }} />
                      </Stack>
                    </HStack>
                    <HStack spacing={0}>
                      <AiFillStar name='star' color='orange' />
                      <AiFillStar name='star' color='orange' />
                      <AiFillStar name='star' color='orange' />
                      <AiFillStar name='star' color='orange' />
                      <AiFillStar name='star' color='orange' />
                    </HStack>
                  </Stack>


                </SimpleGrid>

                <Stack p={3} >
                  <Button size={'sm'} bgColor='green.400' onClick={() => handleOrder(x.flag, x.product_id)}>
                    <Text color={'white'}>🛒 Order now</Text>
                  </Button>
                </Stack>
              </Stack>

            )
          }

        </SimpleGrid>
      ) : (
        <Stack h={'70vh'} alignItems='center' justifyContent={'center'}>
          <Spinner />
        </Stack>
      )}


    </Stack>
  )
}

export default FavoritePage