import React from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';

export default function PageLayout({ children, bg }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const defaultBg = useColorModeValue('gray.50', 'gray.800');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const defaultTextColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const pageBg = bg || defaultBg;
  const textColor = defaultTextColor;
  return (
    <Box
      bg={pageBg}
      color={textColor}
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8 }}
      minH="100vh"
    >
      <Container maxW={{ base: 'container.sm', md: 'container.md', lg: 'container.lg', xl: 'container.xl' }}>
        {children}
      </Container>
    </Box>
  );
}
