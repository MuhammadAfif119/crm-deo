import React from 'react';
import { Box, Divider, Flex, HStack, Icon, Spacer, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import CopyToClipboard from '../../Utils/CopyToClipboard';
import moment from 'moment';
import { AiOutlineFlag } from 'react-icons/ai';
import { CiMoneyBill } from 'react-icons/ci';
import { GiTakeMyMoney } from 'react-icons/gi';
import { HiOutlineHomeModern } from 'react-icons/hi2';
import { GiAirplane } from 'react-icons/gi';


const stepsDummy = [
  { title: 'CUSTOMER PAID', description: 'Customer has paid', icon: CiMoneyBill },
  { title: 'SUPPLIER PAID', description: 'Supplier has paid', icon: GiTakeMyMoney },
  { title: 'IN WAREHOUSE', description: 'In warehouse', icon: HiOutlineHomeModern },
  { title: 'IN SHIPPING', description: 'In shipping', icon: GiAirplane },
  { title: 'IN WAREHOUSE COUNTRY', description: 'In warehouse country', icon: HiOutlineHomeModern },
  { title: 'DONE', description: 'Order completed', icon: AiOutlineFlag },
];

const Step = ({ title, description, isActive, isCompleted, lastStep, icon }) => {
  return (
    <Stack>
      <Stack alignItems={["flex-start", 'flex-start', "center"]} justifyContent={["flex-start", 'flex-start', "center"]}>
        {/* <Box
        w="24px"
        h="24px"
        borderRadius="full"
        bg={isActive || isCompleted ? 'red.500' : 'gray.300'}
        mr={4}
        transition="background-color 0.3s"
      > */}
        <Icon transition="background-color 0.3s"
          boxSize='10' bgColor={isCompleted ? '#ffd600' : 'gray.100'} borderWidth={0.5} shadow={'md'} borderColor='#ffd600' borderRadius='full' as={icon} p='1.5' />
        {/* </Box> */}

      </Stack>
      <Stack alignItems={["flex-start", 'flex-start', "center"]}>
        <Text fontWeight={isActive ? 'bold' : 'normal'} fontSize='sm' textTransform="uppercase">
          {title}
        </Text>
        <Text fontSize="xs">{description ? moment(description).format('LLL') : ''}</Text>
        <Text fontSize="xs" fontStyle="italic" fontWeight="bold">
          {lastStep === title ? moment(description).subtract('YYYYMMDD').fromNow() : ''}
        </Text>
      </Stack>
    </Stack>
  );
};

const CustomStepper = ({ currentStep, message, steps }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const getStepIndex = () => {
    return stepsDummy.findIndex((step) => step.title === currentStep.toUpperCase());
  };

  const updatedSteps = stepsDummy.map((step) => {
    const matchedStep = steps.find((s) => s.title.toUpperCase() === (step.title));
    return {
      ...step,
      description: matchedStep ? matchedStep.created_at : '',
    };
  });


  return (
    <Stack>
      <Flex direction={isMobile ? 'column' : 'row'}>
        {stepsDummy.length > 0 &&
          updatedSteps.map((step, index) => (
            <React.Fragment key={index}>
              {index !== 0 && !isMobile && (
                <Box
                  flex="1"
                  mx={3}
                  h="2px"
                  bg={index <= getStepIndex() ? '#ffd600' : 'gray.300'}
                  alignSelf="center"
                  transition="background-color 0.3s"
                />
              )}
              <Stack>
                <Step
                  title={step.title}
                  icon={step.icon}
                  description={step.description}
                  isActive={step.title === currentStep}
                  isCompleted={index <= getStepIndex()}
                  lastStep={currentStep}
                />
              </Stack>
            </React.Fragment>
          ))}
      </Flex>
      <Divider py={1} />
      <HStack>
        <Text fontSize={'sm'} color="gray.600">
          Message :
        </Text>
        <Text fontSize={'sm'}>{message}</Text>
        <Spacer />
        <CopyToClipboard text={message} />
      </HStack>
    </Stack>
  );
};

export default CustomStepper;