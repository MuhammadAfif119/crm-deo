import { Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import colors from '../Utils/colors'

function AppSponsor() {

    const imageSponsor = [
		'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Kompas.svg/2560px-Kompas.svg.png',
		'https://companieslogo.com/img/orig/D05.SI_BIG.D-dc6f56ef.png?t=1648376862',
		'https://www.xendit.co/wp-content/uploads/2020/11/xendit-logo-white.svg',
		'https://flip.id/aset_gambar/logo_footer.png',
		'https://icehousecorp.com/wp-content/uploads/2019/05/gojek-logo-new-white.png',
		'https://koinworks.com/wp-content/uploads/2022/10/new-logo-koinworks-white.png',
	]


  return (
    <Stack alignItems={'center'} justifyContent='centrer' pt={5}>
        <Text textAlign={'center'} fontWeight={'bold'} fontSize='lg' color={colors.text}>Truested by</Text>
        <SimpleGrid columns={[imageSponsor.length / 2, null, imageSponsor.length]} gap={5}>
            {imageSponsor.length > 0 && imageSponsor.map((x, index) => {
                return (
                    <Stack key={index} p={5} alignItems='center' justifyContent={'center'}>
                        <Image src={x} alt={x} maxW={['100%', null, '60%']} />
                    </Stack>
                )
            })}

        </SimpleGrid>
    </Stack>
  )
}

export default AppSponsor