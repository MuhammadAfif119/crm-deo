import { Box, Button, HStack, Image, Input, InputGroup, InputLeftAddon, Select, Spacer, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import logobelanja from '../../assets/logoitem.png'
import { MdEmail, MdAccountCircle, MdOutlinePhoneIphone, MdFlag, MdLock } from 'react-icons/md'
import colors from '../../Utils/colors'
import AuthContext from '../../Routes/hooks/AuthContext'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../Config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import store from 'store'
import { postImportirAuth } from '../../Api/importirApi'


function SignUpPage() {
	const [name, setName] = useState('')
	const [nohp, setNohp] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [country, setCountry] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const { signUp } = useContext(AuthContext);

	const navigate = useNavigate()
	const toast = useToast()

	const handleSignup = () => {
		const displayName = name;
		if ((email === "" && password === "" && nohp === "" && name === "" && country === "") || password !== confirmPassword)
			return toast({
				title: "Something Wrong",
				description: "check your email, password, data",
				status: "error",
				duration: 10000,
				isClosable: true,
				position: "top-end",
			});

		if (email !== "" && password !== ""  && nohp !== "" && country !== "" && name !== ""  ) {
			try {
				setLoading(true)
				signUp(email, password)
					.then(async (userCredential) => {
						await updateProfile(auth.currentUser, {
							displayName,
						});
						sendEmailVerification(auth.currentUser);

						// Signed in
						const user = userCredential.user;
						if (user) {
							toast({
								title: "Success Create",
								description: `Success Create account ${user.displayName}`,
								status: "success",
								duration: 10000,
								isClosable: true,
								position: "top-right",
							});
						}
						await setDoc(doc(db, "users", user.uid), {
							name: name,
							keyword_name: (name).toLowerCase().split(' ').join(''),
							email: user.email,
							uid_user: user.uid,
							nohp: nohp,
							tanggal_lahir: new Date(),
							country: (country).toLowerCase(),
							role: 'user',
							subscription: 'null',
							createdAt: new Date(),
						});
						let dataSignup = {
							'name': name,
							'email': email,
							'phone': nohp
						  }
		  
						  let userData = {}
		  
						  const result = await postImportirAuth(dataSignup, 'sign-up')
						  console.log(result)
		  
						  if (result.status === true) {
							userData.email = email
							userData.token = result.data
							userData.status = true
							// const data = JSON.stringify(userData)
							// console.log(data, 'data')
							await store.set('userData', userData)
						  }
						  setLoading(false)
						navigate("/", { replace: true });
					})
					.catch((error) => {
						toast({
							title: "Something Wrong",
							description: `It looks like you don't have account in your browser, please signup and reload this page / ${error.message}`,
							status: "error",
							duration: 10000,
							isClosable: true,
							position: "top-right",
						});
						setLoading(false)
					});
			} catch (error) {
				toast({
					title: "Something Wrong",
					description: error,
					status: "error",
					duration: 10000,
					isClosable: true,
					position: "top-end",
				});
				setLoading(false)
			}
		}else{
			toast({
				title: "Something Wrong",
				description: "check your data",
				status: "error",
				duration: 10000,
				isClosable: true,
				position: "top-end",
			});
		}
	}


	return (
		<Stack alignItems={'center'} justifyContent='center' h='80vh' >
			<Stack justifyContent='center' alignItems='center' position={'absolute'} spacing={3} pb={10}>

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
						<InputLeftAddon children={<MdAccountCircle size={24} color="black" />} />
						<Input placeholder="Full name"
							fontSize={'md'}
							type="text"
							bgColor={'white'}
							color={colors.black}
							onChange={(e) => setName(e.target.value)}
						/>
					</InputGroup>

				</Stack>

				<Stack alignItems="center">
					<InputGroup w={{
						base: '100%',
						md: '285'
					}}>
						<InputLeftAddon children={<MdOutlinePhoneIphone size={24} color="black" />} />
						<Input w={{
							base: '100%',
							md: '100%'
						}} placeholder="Number phone"
							fontSize={'md'}
							type="number"
							bgColor={'white'}
							color={colors.black}
							onChange={(e) => setNohp(e.target.value)}
						/>
					</InputGroup>
				</Stack>

				<Stack alignItems="center">
					<InputGroup w={{
						base: '100%',
						md: '285'
					}}>
						<InputLeftAddon children={<MdEmail name="email" size={24} color="black" />} />
						<Input w={{
							base: '100%',
							md: '100%'
						}} placeholder="Email"
							fontSize={'md'}
							bgColor={'white'}
							color={colors.black}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</InputGroup>
				</Stack>

				<Stack alignItems="center">
					<InputGroup w={{
						base: '100%',
						md: '285'
					}}>
						<InputLeftAddon children={<MdFlag size={24} color="black" />} />
						<Select fontSize='md' w='210px' bgColor={'white'} placeholder="All" onChange={(e) => setCountry(e.target.value)}>
							<option value="indonesia">Indonesia</option>
							<option value="thailand">Thailand</option>
							<option value="usa">USA</option>
							<option value="china">China</option>
						</Select>
					</InputGroup>
				</Stack>


				<Stack alignItems="center">
					<InputGroup w={{
						base: '100%',
						md: '285'
					}}>
						<InputLeftAddon children={<MdLock size={24} color="black" />} />
						<Input w={{
							base: '100%',
							md: '100%'
						}} placeholder="Password"
							fontSize={'md'}
							type="password"
							bgColor={'white'}
							color={colors.black}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</InputGroup>
				</Stack>

				<Stack alignItems="center">
					<InputGroup w={{
						base: '100%',
						md: '285'
					}}>
						<InputLeftAddon children={<MdLock size={24} color="black" />} />
						<Input w={{
							base: '100%',
							md: '100%'
						}} placeholder="Confirm password"
							fontSize={'md'}
							id="password"
							type="password"
							bgColor={'white'}
							color={colors.black}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</InputGroup>
				</Stack>



				{loading ? (
					<Spinner size={'sm'} />
				) : (
					<Button w='80%' size={'sm'} bgColor={colors.theme} onClick={() => handleSignup()}  >
						<Text color={colors.black} fontWeight="bold">
							CREATE ACCOUNT
						</Text>
					</Button>
				)}

				<Spacer />
				<Spacer />

				<HStack space={1}>
					<Text color={'black'}>Back to</Text>
					<Text color={'black'} fontWeight='bold' onClick={() => navigate('/login')}>Login</Text>
				</HStack>
			</Stack>
		</Stack>
	)
}

export default SignUpPage