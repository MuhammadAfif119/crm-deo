import { Box, Button, HStack, Image, Input, InputGroup, InputLeftAddon, Select, Spacer, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import logo from '../../assets/1.png'
import { MdEmail, MdAccountCircle, MdOutlinePhoneIphone, MdFlag, MdLock } from 'react-icons/md'
import colors from '../../Utils/colors'
import AuthContext from '../../Routes/hooks/AuthContext'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../Config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import store from 'store'
import { postImportirAuth } from '../../Api/importirApi'
import AppHeader from '../../Components/AppHeader'
import moment from 'moment'
import AppSponsor from '../../Components/AppSponsor'
import ApiBackend from '../../Api/ApiBackend'


function SignUpPage() {
	const [name, setName] = useState('')
	const [nohp, setNohp] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	// const [instagram, setInstagram] = useState("");
	const [loading, setLoading] = useState(false)

	const { signUp } = useContext(AuthContext);

	const navigate = useNavigate()
	const toast = useToast()

	const handleSignup = () => {
		const displayName = name;
		if ((email === "" && password === "" && nohp === "" && name === "") || password !== confirmPassword)
			return toast({
				title: "Something Wrong",
				description: "check your email, password, data",
				status: "error",
				duration: 10000,
				isClosable: true,
				position: "top-end",
			});

		if (email !== "" && password !== "" && nohp !== "" && name !== "") {
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

							await setDoc(doc(db, "users", user.uid), {
								name: name,
								keyword_name: (name).toLowerCase().split(' ').join(''),
								email: user.email,
								uid_user: user.uid,
								nohp: nohp,
								role: 'user',
								subscription: 'owner',
								createdAt: new Date(),
								enrollmentDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
							});

							setLoading(false)
							navigate("/login", { replace: true });

							toast({
								title: "Success Create",
								description: `Success Create account ${user.displayName}`,
								status: "success",
								duration: 10000,
								isClosable: true,
								position: "top-right",
							});
						}
						// const res = await ApiBackend.post('createprofile', {
						// 	title: email,
						// })
						// if (res.status === 200) {
						// 	console.log(res.data, 'xxx')
						// 	await setDoc(doc(db, "users", user.uid), {
						// 		name: name,
						// 		keyword_name: (name).toLowerCase().split(' ').join(''),
						// 		email: user.email,
						// 		uid_user: user.uid,
						// 		nohp: nohp,
						// 		role: 'user',
						// 		subscription: 'trial',
						// 		createdAt: new Date(),
						// 		enrollmentDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
						// 		ayrshare_account : res.data
						// 	});

						// 	setLoading(false)
						// 	navigate("/login", { replace: true });
						// }
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
		} else {
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


	const height = window.innerHeight
	const width = window.innerWidth



	return (
		<>
			{/* <AppHeader /> */}

			<Stack pt={20} spacing={10} minH={height} bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg) no-repeat center center fixed" bgSize="cover" alignItems={'center'} justifyContent='center' >
				<Stack alignItems={'center'} justifyContent='center'>
					<Stack w={['90%', null, width / 4]} spacing={3} p={10} bgColor="blackAlpha.600" shadow={'md'} borderRadius={'xl'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} alignItems={'center'} justifyContent='center'>
						<Box >
							<Image

								w='200px'
								borderRadius={20}
								src={logo}
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
									fontSize={'sm'}
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
									fontSize={'sm'}
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
									fontSize={'sm'}
									bgColor={'white'}
									color={colors.black}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</InputGroup>
						</Stack>

						{/* <Stack alignItems="center">
							<InputGroup w={{
								base: '100%',
								md: '285'
							}}>
								<InputLeftAddon children={<AiFillInstagram name="instagram" size={24} color="black" />} />
								<Input w={{
									base: '100%',
									md: '100%'
								}} placeholder="Social Media"
									fontSize={'sm'}
									bgColor={'white'}
									color={colors.black}
									onChange={(e) => setInstagram(e.target.value)}
								/>
							</InputGroup>
						</Stack> */}




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
									fontSize={'sm'}
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
									fontSize={'sm'}
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
							<Button w='80%' size={'sm'} bgColor={colors.buttonPrimary} onClick={() => handleSignup()}  >
								<Text color={colors.buttonSecondary} fontSize='xs' fontWeight="bold">
									CREATE ACCOUNT
								</Text>
							</Button>
						)}

						<Spacer />
						<Spacer />

						<HStack space={1}>
							<Text color={'gray.400'} fontSize='sm'>Back to</Text>
							<Text color={'gray.400'} fontWeight='bold' fontSize='sm' onClick={() => navigate('/login')}>Login</Text>
						</HStack>
					</Stack>
				</Stack>

				<Stack>
					<AppSponsor />
				</Stack>

			</Stack>
		</>
	)
}

export default SignUpPage