import { Avatar, Box, HStack, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { clientTypessense } from '../../Api/Typesense';
import useUserStore from '../../Hooks/Zustand/Store';

function InputSearchUserComponent(props) {
    const globalState = useUserStore();
	const [search,setSearch]=useState()
	const [counter,setCounter]=useState(0)
	const [data,setData]=useState()

	const handleSearch=(q,p)=>{
		console.log("handlesearch")
		setSearch({query:q,page:p})
		const searchParameters = {
			q: q,
			query_by: "email",
			filter_by: `id: [${globalState.users}]`,
			page:p,
			sort_by: "_text_match:desc"
		};
		clientTypessense
			.collections("users")
			.documents()
			.search(searchParameters)
			.then((x) => {
				setCounter(x.found)
				const newData = x.hits.map((y) => { return { ...y.document } })
								
				if(p===1)
				setData(newData)
				else
				setData([...data,...newData])

			});
	}

	useEffect(() => {
		handleSearch('*',1)
	
	  return () => {
		setData()
	  }
	}, [globalState?.users])
	
  return (
	<Box>
		<Input type='text' onChange={(e)=>handleSearch(e.target.value,1)}/>
		{data?.map((x,i)=>
		<HStack key={i} bgColor='white' borderRadius='md' p='2' m='2' 
		onClick={()=>{
			console.log("oclick")
			const newArr=[...props?.user?.filter((z)=>z!==x.id),x.id]
			props.setUser(newArr)
			props.onClose()

			}}>
			<Avatar name={x?.name} />
			<Box>
				<Text>{x?.name}</Text>
				<Text>{x?.email}</Text>
				<Text fontSize='2xs'>ID: {x?.id}</Text>
			</Box>
		</HStack>
		)}
	</Box>
  )
}

export default InputSearchUserComponent