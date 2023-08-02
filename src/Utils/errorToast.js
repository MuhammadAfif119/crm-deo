import { useToast } from '@chakra-ui/react';

const ErrorToast = ({ title, description }) => {
  const toast = useToast();
  toast({
    title: title,
    description: description,
    status: "error",
    duration: 5000,
    isClosable: true,
  });
  return null;
};

export default ErrorToast;
