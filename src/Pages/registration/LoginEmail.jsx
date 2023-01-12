import { Box, Button, HStack, Image, Input, InputGroup, InputLeftAddon, Spacer, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import logobelanja from '../../assets/logoitem.png'
import { MdEmail, MdVpnKey } from 'react-icons/md'
import colors from '../../Utils/colors'
import AuthContext from '../../Routes/hooks/AuthContext'
import { useNavigate } from 'react-router-dom'

function LoginEmail() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { login, currentUser } = useContext(AuthContext)
    const toast = useToast()
    const navigate = useNavigate()

    if(currentUser){
        navigate(-1)
    }



    const handleLogin = async () => {
        if (email !== '' && password !== '') {
          login(email, password)
        } else {
          toast({
            title: 'BELANJA.ID',
            message: 'Cek kembali email dan password anda.',
            color: 'warning'
          })
        }
      }
    

    return (
            <Stack alignItems={'center'} justifyContent='center' h='100vh' >
                <Stack justifyContent='center' alignItems='center' position={'absolute'}  spacing={3} pb={10}>

                    <Box >
                        <Image
                            w='200px'
                            borderRadius={20}
                            src={logobelanja}
                            alt="Alternate Text"
                        />
                    </Box>
                    <Spacer />
                    <Stack alignItems="center">
                        <InputGroup w={{
                            base: '100%',
                            md: '285'
                        }}>
                            <InputLeftAddon shadow={'md'} children={<MdEmail name="email" size={24} color="black" />} />
                            <Input w={{
                                base: '100%',
                                md: '100%'
                            }} placeholder="email"
                            fontSize={'md'}
                                shadow={3}
                                bgColor={'white'}
                                color={colors.black}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                    </Stack>
                    <Stack alignItems="center">
                        <InputGroup w={{
                            base: '100%',
                            md: '100%'
                        }}>
                            <InputLeftAddon shadow={'md'} children={<MdVpnKey  size={24} color="black" />} />
                            <Input w={{
                                base: '100%',
                                md: '100%'
                            }} placeholder="password"
                            fontSize={'md'}
                                shadow={'md'}
                                type="password"
                                bgColor={'white'}
                                color={colors.black}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>
                    </Stack>

                    <Button shadow={'md'}  size={'sm'} bgColor={colors.theme} onClick={() => handleLogin()}  >
                        <Text color={colors.black} fontWeight="bold">
                            CONTINUE
                        </Text>
                    </Button>

                    <Spacer />

                    <HStack space={1}>
                        <Text color={'gray.600'} >Don't have any account ?</Text>
                        <Text color={'gray.600'}  cursor='pointer' fontWeight='bold' onClick={() => navigate("/signup")}>Join now !</Text>
                    </HStack>
                </Stack>
            </Stack>
    )
}

export default LoginEmail