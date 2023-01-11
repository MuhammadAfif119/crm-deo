import { Box, Button, Heading, HStack, Image, Spacer, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useContext } from 'react'
import _axios from '../Api/AxiosBarrier'
import AuthContext from '../Routes/hooks/AuthContext'
import { formatFrice } from '../Utils/Helper'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

function CartPage() {

  const { getCart, cart, totalPrice } = useContext(AuthContext)

  const height = window.innerHeight

  const navigate = useNavigate()

  const toast = useToast()

  const handleDelete = async (id) => {
    console.log(id, 'yy')
    try {
      const res = await _axios.delete(`api/blj-cart/${id}/delete`)
      if (res) {
        toast({
          title: 'BELANJA.ID',
          description: 'Berhasil menghapus produk di cart.',
          status: 'success'
        })
        getCart()
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Stack bgColor={'gray.100'} minH={height}>

      <Stack shadow={'md'} p='5' >
        <HStack>
          <Box>
            <Text color={'gray.700'}>Total Harga</Text>
            <Heading size={'lg'} fontWeight='extrabold'>Rp {formatFrice(totalPrice)}</Heading>
          </Box>
          <Spacer />
          {cart?.data?.length > 0 && (
            <Stack alignItems={'center'} justifyContent='center'>
              <Button bgColor={'green.600'} onClick={() => navigate('/checkout')} size='md'>
                <HStack spacing={2} alignItems='center' justifyContent={'center'}>
                  {/* <Ionicons name='cart-outline' size='xl'
                    style={{ fontSize: 20, color: 'white' }}
                  /> */}
                  <Text fontSize={'md'} color='white' fontWeight={'bold'}>Checkout</Text>
                </HStack>
              </Button>
            </Stack>
          )}
        </HStack>
      </Stack>

      {cart?.data?.length > 0 ? (
        cart?.data?.map((x, index) =>
          <Stack bgColor={'white'} key={index} spacing={1} borderRadius='xl' m={2} p={2} shadow={'md'}>

            <Stack onClick={() => handleDelete(x.id)} alignItems='flex-end' cursor={'pointer'}>
              <AiOutlineCloseCircle size={20} color="black" />
            </Stack>


            <HStack spacing={2} alignItems='center' justifyContent={'space-around'}>

              <Stack shadow={5}>
                <Image src={x.product_image} alt={x.product_name} borderRadius={'xl'} w='150px' />
              </Stack>

              <Stack maxW={'50%'} spacing={1} >
                <Text numberOfLines={2} fontWeight={'bold'} fontSize='sm'>{(x.product_name)}</Text>
                <Text color={'gray.700'} fontSize='sm'>Rp. {formatFrice(x.price / x.quantity)} / pcs</Text>
                <Text color={'gray.700'} fontSize='sm'>Quantity : {(x.quantity)}</Text>
              </Stack>


              <Stack maxW={'30%'} spacing={1}   >

                <Stack spacing={0}>
                  <Text color={'gray.700'} fontSize='sm'>Total</Text>
                  <Text color={'green.700'} fontWeight='bold'>Rp {formatFrice(x.price)}</Text>
                </Stack>
              </Stack>
            </HStack>
          </Stack>
        )
      ) : (
        <Stack h={height} alignItems='center' justifyContent={'center'}>
          <Spinner />
        </Stack>
      )}


    </Stack>
  )
}

export default CartPage