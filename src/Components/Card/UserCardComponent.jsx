import { Avatar, Box, HStack, Skeleton, SkeletonCircle, SkeletonText, Spacer, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { clientTypessense } from '../../Api/Typesense'

function UserCardComponent(props) {
	const [data,setData]=useState()
	const uid=props.uid

	const getData=()=>{
		const searchParameters = {
			q: '*',
			query_by: "email",
			filter_by: `id: ${uid}`,
		};
		clientTypessense
			.collections("users")
			.documents()
			.search(searchParameters)
			.then((x) => {
				const newData = x.hits.map((y) => { return { ...y.document } })
				setData(newData[0])
			});
	}

	useEffect(() => {
	  getData(uid)
	
	  return () => {
		setData()
	  }
	}, [])
	
  return (
	  data?
		<HStack m='1' p='1' shadow='base'>
			
			<Avatar name={data?.name} />
			<Box>
				<Text>{data?.name}</Text>
				<Text>{data?.email}</Text>
				<Text fontSize='3xs'>ID: {uid}</Text>
			</Box>
			<Spacer/>
			<Text 
			alignSelf='start' 
			onClick={()=>props.setUser([...props.user.filter((z)=>z!==uid)])}
			>x</Text>
		</HStack>  
		:
		<HStack m='1' p='1' shadow='base'>
		<SkeletonCircle/>
			<Box>
				<SkeletonText/>
				<SkeletonText/>
				<SkeletonText/>
			</Box>
		</HStack>
		)
}

export default UserCardComponent