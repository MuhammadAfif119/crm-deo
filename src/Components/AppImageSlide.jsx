import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Image, Stack } from "@chakra-ui/react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const images = [
  "https://buildfire.com/wp-content/uploads/2023/02/Fish-Action-Captain.png",
  "https://buildfire.com/wp-content/uploads/2023/02/Balance-By-Hillary.png",
  "https://buildfire.com/wp-content/uploads/2023/02/Saudi-Green-Initiative.png",
  "https://buildfire.com/wp-content/uploads/2023/02/Space-City-Music.png",
  "https://buildfire.com/wp-content/uploads/2023/02/Cross-Roadz.png"
];

const ImageSlide = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const [prevImage, setPrevImage] = useState(images.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage);
      setCurrentImage(nextImage);
      setNextImage(nextImage === images.length - 1 ? 0 : nextImage + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentImage, nextImage]);

  const next = () => {
    setPrevImage(currentImage);
    setCurrentImage(nextImage);
    setNextImage(nextImage === images.length - 1 ? 0 : nextImage + 1);
  };

  const prev = () => {
    setNextImage(currentImage);
    setCurrentImage(prevImage);
    setPrevImage(prevImage === 0 ? images.length - 1 : prevImage - 1);
  };

  return (
    <Stack align="center" justify="center">
      <HStack>
        <Image
          src={images[prevImage]}
          alt="Previous image"
          width="40%"
          height="40%"
          objectFit="cover"
          left="-800px"
        />
        <Image
          src={images[currentImage]}
          alt="Current image"
          width="50%"
          height="50%"
          objectFit="cover"
        />
        <Image
          src={images[nextImage]}
          alt="Next image"
          width="60%"
          height="60%"
          objectFit="cover"
          left="800px"
        />
        <Button onClick={prev} position="absolute" left={1} bgColor='transparent'>
          <SlArrowLeft color="white" />
        </Button>
        <Button onClick={next} position="absolute" right={1} bgColor='transparent'>
          <SlArrowRight color="white"  />
        </Button>
      </HStack>
    </Stack>
  );
};

export default ImageSlide;