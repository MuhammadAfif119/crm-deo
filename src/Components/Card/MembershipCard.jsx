import { Stack, Text, Heading, Checkbox, SimpleGrid } from '@chakra-ui/react'; 
import { formatFrice } from '../../Utils/Helper';
// Import Chakra UI components or replace with your own components

const MembershipCard = ({ membership, selectedMemberships, handleMembershipSelect }) => {
    return (
        <Stack
            bgColor='white'
            borderRadius={'md'}
            shadow='md'
            p={5}
            alignItems={'center'}
            justifyContent='center'
        >
            <Text textTransform={'capitalize'} fontWeight={500}>{membership.package_name}</Text>
            <Heading size={'lg'}>Rp.{formatFrice(membership.package_amount)}</Heading>
            <Text textTransform={'capitalize'}>{membership.package_expired_duration || membership.package_expired}</Text>
            <Text textTransform={'uppercase'}>{membership.package_code}</Text>
            <Checkbox
                isChecked={selectedMemberships.includes(membership.package_code)}
                onChange={() => handleMembershipSelect(membership.package_code)}
            >
                Select
            </Checkbox>
        </Stack>
    );
};

export default MembershipCard;
