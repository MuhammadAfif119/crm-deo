import { Button, Center, Container, Heading, HStack, Input, Stack } from '@chakra-ui/react'
import { RecaptchaVerifier, signInWithPhoneNumber, } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../Components/AppHeader'
import { auth } from '../../Config/firebase';

function LoginPage() {
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [numberPhone, setNumberPhone] = useState()
	const [expandForm, setExpandForm] = useState(false)
	const [otpCode, setOtpCode] = useState('')

	const countryCode = "+62"

	const navigate = useNavigate()

	const generateRecaptcha = () => {
		window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
			'size': 'invisible',
			'callback': (response) => {
				console.log(response, 'response')
				// reCAPTCHA solved, allow signInWithPhoneNumber.
			}
		}, auth);
	}

	const verifyOtp = () => {
		if (otpCode.length === 6) {
			console.log(otpCode)
			let confirmationResult = window.confirmationResult
			confirmationResult.confirm(otpCode).then((result) => {
				// User signed in successfully.
				const user = result.user;
				console.log(user, 'user')
				// ...
				navigate('/')
			}).catch((error) => {
				// User couldn't sign in (bad verification code?)
				// ...
				console.log(error, 'error')
			});
		}
	}



	const setUpRecaptcha = () => {
		setExpandForm(true)
		generateRecaptcha()
		let appVerifier = window.recaptchaVerifier
		signInWithPhoneNumber(auth, numberPhone, appVerifier)
			.then(confirmationResult => {
				window.confirmationResult = confirmationResult
			})
			.catch(function (error) {
				// Error; SMS not sent
				// ...
				console.log(error)
			});
	}

	return (
		<>

			<Center height='90vh'>
				<Stack>
					<div id="recaptcha-container"></div>
					<Heading>Login</Heading>
					<Input type='text' maxW='2xs' placeholder='numberPhone' width='full' onChange={(e) => setNumberPhone(e.target.value)} />
					<Button colorScheme='teal' id='sign-in-button' onClick={() => setUpRecaptcha()}>Login</Button>
					{expandForm && (
						<Stack>
							<Input type='text' maxW='2xs' placeholder='OTP' width='full' onChange={(e) => setOtpCode(e.target.value)} />
							<Button onClick={() => verifyOtp()}>Verify OTP</Button>
						</Stack>
					)}
					<HStack>
						<Button colorScheme='twitter'>
							<Link to="/signup">Sign Up</Link>
						</Button>
						<Button colorScheme='red'>Forget Password</Button>
					</HStack>
				</Stack>

			</Center>

		</>
	)
}

export default LoginPage