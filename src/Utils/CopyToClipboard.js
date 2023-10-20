import React, { useRef } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

const CopyToClipboard = ({ text }) => {
  const inputRef = useRef(null);
  
  const toast = useToast({
    position: "top",
    align: "center",
});

  const copyToClipboard = () => {
    inputRef.current.select();
    document.execCommand('copy');
    toast({
      title: 'Copied',
      description: 'The text has been copied to the clipboard.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        value={text}
        style={{ position: 'fixed', top: '-9999px' }}
        readOnly
      />
      <Button
        leftIcon={<FaCopy />}
        onClick={copyToClipboard}
        size="xs"
        colorScheme="facebook"
      >
        Copy
      </Button>
    </>
  );
};

export default CopyToClipboard;