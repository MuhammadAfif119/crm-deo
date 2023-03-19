import React, { useState, useEffect } from 'react';
import { Box, Image } from '@chakra-ui/react';

const AppImageSlideAgain = ({ images }) => {
  const [current, setCurrent] = useState(0);

  console.log(images)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(current === images.length - 1 ? 0 : current + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [current, images]);

  return (
    <Box>
      {images?.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index}`}
          display={index === current ? 'block' : 'none'}
        />
      ))}
    </Box>
  );
};

export default AppImageSlideAgain;