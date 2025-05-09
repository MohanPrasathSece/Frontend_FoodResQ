import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
  useColorMode,
  IconButton
} from '@chakra-ui/react';
// Use react-icons for theme icons
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg={bgColor} px={{ base: 2, md: 4 }} py={{ base: 2, md: 0 }} boxShadow='sm'>
      <Flex alignItems='center' justifyContent='space-between' py={{ base: 2, md: 0 }}>
        <Link as={RouterLink} to='/' _hover={{ textDecoration: 'none' }}>
          <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight='extrabold' color='brand.500'>
            Food Rescue Network
          </Text>
        </Link>

        <Flex alignItems='center'>
          <Stack direction='row' spacing={4} alignItems='center'>
            <IconButton
              aria-label='Toggle theme'
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              variant='ghost'
              onClick={toggleColorMode}
            />
            {!user ? (
              <Stack direction='row' spacing={4} alignItems='center'>
                <Button as={RouterLink} to='/login' variant='ghost' colorScheme='brand'>Login</Button>
                <Button as={RouterLink} to='/register' colorScheme='brand'>Register</Button>
              </Stack>
            ) : (
              <Flex alignItems='center'>
                <Menu display={{ base: 'block', md: 'none' }}>
                  <MenuButton as={IconButton} aria-label='Open menu' icon={<FaBars />} variant='outline' mr={2} />
                  <MenuList>
                    <MenuItem as={RouterLink} to='/'>Home</MenuItem>
                    <MenuItem as={RouterLink} to={`/${user.role}/dashboard`}>{user.role === 'donor' ? 'My Donations' : 'Available Donations'}</MenuItem>
                    <MenuItem as={RouterLink} to='/history'>History</MenuItem>
                    <MenuItem as={RouterLink} to='/profile'>Profile</MenuItem>
                    <MenuItem as={RouterLink} to='/help'>Help</MenuItem>
                    <MenuItem onClick={toggleColorMode}>Toggle Theme</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
                <Stack direction='row' spacing={4} alignItems='center' display={{ base: 'none', md: 'flex' }}>
                  {/* Home link to landing page */}
                  <Button as={RouterLink} to='/' variant='ghost'>Home</Button>
                  <Button as={RouterLink} to={`/${user.role}/dashboard`} variant='ghost'>
                    {user.role === 'donor' ? 'My Donations' : 'Available Donations'}
                  </Button>
                  <Button as={RouterLink} to='/history' variant='ghost'>History</Button>
                  <Button as={RouterLink} to='/profile' variant='ghost'>Profile</Button>
                  <Button as={RouterLink} to='/help' variant='ghost'>Help</Button>
                  <Button onClick={handleLogout} variant='ghost'>Logout</Button>
                </Stack>
              </Flex>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;