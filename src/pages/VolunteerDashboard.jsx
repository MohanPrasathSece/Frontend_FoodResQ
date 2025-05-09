import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Stack,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function VolunteerDashboard() {
  // color mode values
  const pageBg = useColorModeValue('gray.50','gray.800');
  const containerBg = useColorModeValue('white','gray.700');
  const cardBg = useColorModeValue('white','gray.600');
  const textColor = useColorModeValue('gray.800','whiteAlpha.900');
  const historySectionBg = useColorModeValue('gray.100','gray.700');
  const historyCardBg = useColorModeValue('white','gray.600');
  const [availableDonations, setAvailableDonations] = useState([]);
  const [historyDonations, setHistoryDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchAvailableDonations();
    fetchHistoryDonations();
  }, []);

  const fetchAvailableDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donations/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableDonations(response.data);
    } catch (error) {
      console.error('Error fetching available donations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch donations',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchHistoryDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/donations/user/history', { headers: { Authorization: `Bearer ${token}` }});
      setHistoryDonations(response.data);
    } catch (error) {
      console.error('Error fetching donation history:', error.response?.data?.message || error.message);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to fetch donation history', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handlePickupRequest = async (donation) => {
    try {
      const token = localStorage.getItem('token');
      // Fetch full details for this donation
      const response = await axios.get(`/api/donations/${donation._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedDonation(response.data);
      onOpen();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load donation details', status: 'error', duration: 3000, isClosable: true });
    }
  };


  const confirmPickup = async () => {
    try {
      const token = localStorage.getItem('token');
      const pickupTime = new Date().toISOString();
      await axios.patch(
        `/api/donations/${selectedDonation._id}/claim`,
        { pickupTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: 'Success',
        description: 'Donation claimed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchAvailableDonations();
      fetchHistoryDonations();
    } catch (error) {
      console.error('Error claiming donation:', error.response?.data?.message || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to claim donation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Mark a pickup as completed
  const handleCompletePickup = async (pickupId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/pickups/${pickupId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Success', description: 'Pickup completed', status: 'success', duration: 3000, isClosable: true });
      fetchHistoryDonations();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to pick up donation', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Add delivered handler
  const handleDelivered = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/donations/${donationId}/delivered`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Delivered', description: 'Donation marked as delivered.', status: 'success', duration: 3000, isClosable: true });
      fetchAvailableDonations();
      fetchHistoryDonations();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to mark as delivered', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Add not delivered handler
  const handleNotDelivered = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/donations/${donationId}/expired`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Expired', description: 'Donation marked as not delivered (expired).', status: 'warning', duration: 3000, isClosable: true });
      fetchAvailableDonations();
      fetchHistoryDonations();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to mark as expired', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box
      bgImage="url('https://1.bp.blogspot.com/-hGztsaeIFhY/Wi046IYRhwI/AAAAAAAAAJ0/fkZLk1ZSqCcBYLbaWy8WUGzrLlOlOXFgQCPcBGAYYCw/s1600/DSC_0097.JPG')"
      bgSize="cover"
      bgPosition="center"
      filter="brightness(0.3)"
      minH="100vh"
      color={textColor}
      py={{ base: 4, md: 10 }}
    >
      <Container maxW={{ base: 'container.sm', md: '6xl' }} px={{ base: 2, md: 4 }} mx="auto" position="relative" zIndex={1}>
        <Stack spacing={8}>
          {/* Available Donations */}
          <Box p={{ base: 2, md: 4 }}>
            <Box bg={containerBg} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="md" mb={5} textAlign="center">
              <Heading size={{ base: 'md', md: 'lg' }}>
                Find Food <Badge ml={2} colorScheme="blue">{availableDonations.length}</Badge>
              </Heading>
            </Box>
            {availableDonations.length > 0 ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 8 }}>
                {availableDonations.filter(d => d.status !== 'claimed').map((donation) => (
                  <Card key={donation._id} p={{ base: 1, md: 2 }} boxShadow="md" _hover={{ transform: 'translateY(-4px)' }} transition="0.2s">
                    <CardHeader display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="sm">{donation.foodName}</Heading>
                    </CardHeader>
                    <CardBody p={{ base: 1, md: 2 }}>
                      <Box position="relative" width="100%">
                        <Badge position="absolute" top={2} right={2} colorScheme="purple" zIndex={1}>{donation.quantity} {donation.unit}</Badge>
                        {donation.imageUrl ? (
                          <Image
                            src={
                              donation.imageUrl.startsWith('data:')
                                ? donation.imageUrl
                                : `${axios.defaults.baseURL}${donation.imageUrl}`
                            }
                            alt={donation.foodName}
                            boxSize={{ base: '80px', md: '100px' }}
                            objectFit="cover"
                            mb={3}
                          />
                        ) : donation.image?.data ? (
                          <Image
                            src={`data:${donation.image.contentType};base64,${donation.image.data}`}
                            alt={donation.foodName}
                            boxSize={{ base: '80px', md: '100px' }}
                            objectFit="cover"
                            mb={3}
                          />
                        ) : (
                          <Box
                            boxSize={{ base: '80px', md: '100px' }}
                            bg="gray.200"
                            mb={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="md"
                          >
                            <Text color="gray.500">No Image</Text>
                          </Box>
                        )}
                      </Box>
                      <Box p={3}>
                        <Text fontSize="sm" noOfLines={1}>{donation.description}</Text>
                      </Box>
                      <Text fontSize="sm" color="gray.700"><strong>Expires On:</strong> {new Date(donation.expirationDate).toLocaleString()}</Text>
                      <Text fontSize="sm" color="gray.700"><strong>Pickup Address:</strong> {donation.pickupAddress?.street}, {donation.pickupAddress?.city}, {donation.pickupAddress?.state} {donation.pickupAddress?.zipCode}</Text>
                    </CardBody>
                    <CardFooter justify="space-between">
                      <Button colorScheme="blue" onClick={() => handlePickupRequest(donation)}>Claim</Button>
                      <Button
                        as="a"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${donation.pickupAddress.street}, ${donation.pickupAddress.city}, ${donation.pickupAddress.state} ${donation.pickupAddress.zipCode}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="outline"
                      >
                        View on Map
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Text>No donations available at the moment. Please check back soon.</Text>
            )}
          </Box>

          {/* Claimed by Me */}
          {historyDonations.filter(d => d.status === 'claimed').length > 0 && (
            <Box bg="green.50" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="sm">
              <Heading size="md" mb={4} color="green.700">
                Pending Delivery <Badge ml={2} colorScheme="green">{historyDonations.filter(d => d.status === 'claimed').length}</Badge>
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 8 }}>
                {historyDonations.filter(d => d.status === 'claimed').map((donation) => (
                  <Card key={donation._id} p={4} boxShadow="md" _hover={{ transform: 'translateY(-4px)' }} transition="0.2s">
                    <CardHeader display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="sm">{donation.foodName}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box position="relative" width="100%">
                        <Badge position="absolute" top={2} right={2} colorScheme="purple" zIndex={1}>{donation.quantity} {donation.unit}</Badge>
                        {donation.imageUrl ? (
                          <Image
                            src={
                              donation.imageUrl.startsWith('data:')
                                ? donation.imageUrl
                                : `${axios.defaults.baseURL}${donation.imageUrl}`
                            }
                            alt={donation.foodName}
                            boxSize="150px"
                            objectFit="cover"
                            mb={3}
                          />
                        ) : donation.image?.data ? (
                          <Image
                            src={`data:${donation.image.contentType};base64,${donation.image.data}`}
                            alt={donation.foodName}
                            boxSize="150px"
                            objectFit="cover"
                            mb={3}
                          />
                        ) : (
                          <Box
                            boxSize="150px"
                            bg="gray.200"
                            mb={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="md"
                          >
                            <Text color="gray.500">No Image</Text>
                          </Box>
                        )}
                      </Box>
                      <Box p={3}>
                        <Text fontSize="sm" noOfLines={2}>{donation.description}</Text>
                      </Box>
                      <Text fontSize="sm" color="gray.700"><strong>Expires On:</strong> {new Date(donation.expirationDate).toLocaleString()}</Text>
                      <Text fontSize="sm" color="gray.700"><strong>Pickup Address:</strong> {donation.pickupAddress?.street}, {donation.pickupAddress?.city}, {donation.pickupAddress?.state} {donation.pickupAddress?.zipCode}</Text>
                    </CardBody>
                    <CardFooter>
                      <Button colorScheme="green" mr={2} onClick={() => handleDelivered(donation._id)}>Delivered</Button>
                      <Button bg="red.500" color="white" _hover={{ bg: 'red.600' }} onClick={() => handleNotDelivered(donation._id)}>Not Delivered</Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      </Container>

      {/* Claim Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Pickup Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to claim this donation?</Text>
            {selectedDonation && (
              <>
                <Heading size="md" mb={2}>{selectedDonation.foodName}</Heading>
                {selectedDonation.image && (
                  <Image
                    src={selectedDonation.image.data ? `data:${selectedDonation.image.contentType};base64,${selectedDonation.image.data}` : selectedDonation.image}
                    alt="Donation"
                    mb={2}
                    maxH="200px"
                    objectFit="cover"
                  />
                )}
                <Text mb={2}><b>Type:</b> {selectedDonation.foodType}</Text>
                <Text mb={2}><b>Quantity:</b> {selectedDonation.quantity} {selectedDonation.unit}</Text>
                <Text><strong>Address:</strong> {selectedDonation.pickupAddress?.street}, {selectedDonation.pickupAddress?.city}, {selectedDonation.pickupAddress?.state} {selectedDonation.pickupAddress?.zipCode}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={confirmPickup}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}