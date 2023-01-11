import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import CartPage from '../Pages/CartPage'
import CheckoutPage from '../Pages/CheckoutPage'
import FavoritePage from '../Pages/FavoritePage'
import HelpPage from '../Pages/HelpPage'
import HomePage from '../Pages/HomePage'
import InformationPage from '../Pages/InformationPage'
import InvoiceListPage from '../Pages/InvoiceListPage'
import OrderPage from '../Pages/OrderPage'
import ProductLivePage from '../Pages/ProductLivePage'
import ProductPage from '../Pages/ProductPage'
import ProductSinglePage from '../Pages/ProductSinglePage'
import ProfilePage from '../Pages/ProfilePage'
import LoginEmail from '../Pages/registration/LoginEmail'
import SignUpPage from '../Pages/registration/SignUpPage'
import ShippingPage from '../Pages/ShippingPage'
import TermConditionPage from '../Pages/TermConditionPage'
import ProtectedRoutesUser from './ProtectRoutesUser'

function MainRoute() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/product" element={<ProductPage />} />
			<Route path="/login" element={<LoginEmail />} />
			<Route path="/signup" element={<SignUpPage />} />
			
			<Route path="/termcondition" element={<TermConditionPage />} />
			<Route path="/help" element={<HelpPage />} />
			<Route path="/information" element={<InformationPage />} />

			<Route path="/shipping" element={
				<ProtectedRoutesUser>
					<ShippingPage />
				</ProtectedRoutesUser>
			} />


			<Route path="/order" element={
				<ProtectedRoutesUser>
					<OrderPage />
				</ProtectedRoutesUser>
			} />

			<Route path="/invoices" element={
				<ProtectedRoutesUser>
					<InvoiceListPage />
				</ProtectedRoutesUser>
			} />

			<Route path="/product/:type/:id" element={
				<ProtectedRoutesUser>
					<ProductSinglePage />
				</ProtectedRoutesUser>
			} />

			<Route path="/productlive/:id" element={
				<ProtectedRoutesUser>
					<ProductLivePage />
				</ProtectedRoutesUser>
			} />

			<Route path="/favorite" element={
				<ProtectedRoutesUser>
					<FavoritePage />
				</ProtectedRoutesUser>
			} />
			<Route path="/cart" element={
				<ProtectedRoutesUser>
					<CartPage />
				</ProtectedRoutesUser>
			} />
			<Route path="/checkout" element={
				<ProtectedRoutesUser>
					<CheckoutPage />
				</ProtectedRoutesUser>
			} />
			{/* <Route path="/checkout/:param" element={<CheckoutPage />} /> */}
			<Route path="/profile" element={
				<ProtectedRoutesUser>
					<ProfilePage />
				</ProtectedRoutesUser>
			} />

		</Routes>
	)
}

export default MainRoute