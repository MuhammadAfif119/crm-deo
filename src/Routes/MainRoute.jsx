import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import HelpPage from '../Pages/HelpPage'
import InformationPage from '../Pages/InformationPage'
import MyFeedRssPage from '../Pages/MyFeedRssPage'
import LoginEmail from '../Pages/registration/LoginEmail'
import SignUpPage from '../Pages/registration/SignUpPage'
import SocialAccountPage from '../Pages/SocialAccountPage'
import SocialBuildPage from '../Pages/SocialBuildPage'
import TermConditionPage from '../Pages/TermConditionPage'

function MainRoute() {
	return (
		<Routes>


			<Route path="/login" element={<LoginEmail />} />
			<Route path="/signup" element={<SignUpPage />} />
			<Route path="/" element={<SocialBuildPage />} />
			<Route path="/social-account" element={<SocialAccountPage />} />
			<Route path="/my-feed" element={<MyFeedRssPage />} />
			
			<Route path="/termcondition" element={<TermConditionPage />} />
			<Route path="/help" element={<HelpPage />} />
			<Route path="/information" element={<InformationPage />} />

		</Routes>
	)
}

export default MainRoute