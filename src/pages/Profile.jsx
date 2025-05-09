import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Box, Container, Heading, FormControl, FormLabel, Input, Button, Avatar, useToast, useColorModeValue, Text } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', phone:'', avatar:'', street:'', city:'', state:'', zipCode:'' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const containerBg = useColorModeValue('white','gray.700');
  const pageBg = useColorModeValue('gray.50','gray.800');
  const textColor = useColorModeValue('gray.800','whiteAlpha.900');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = res.data;
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          avatar: profile.avatar || '',
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          zipCode: profile.address?.zipCode || ''
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast({ title:'Failed to fetch profile', status:'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    if (form.name) formData.append('name', form.name);
    if (form.email) formData.append('email', form.email);
    if (form.phone) formData.append('phone', form.phone);
    if (form.street) formData.append('address[street]', form.street);
    if (form.city) formData.append('address[city]', form.city);
    if (form.state) formData.append('address[state]', form.state);
    if (form.zipCode) formData.append('address[zipCode]', form.zipCode);
    if (file) formData.append('avatar', file);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast({ title:'Profile updated', status:'success' });
      // Refetch profile after save
      const res = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data;
      setForm({
        name: updated.name || '',
        email: updated.email || '',
        phone: updated.phone || '',
        avatar: updated.avatar || '',
        street: updated.address?.street || '',
        city: updated.address?.city || '',
        state: updated.address?.state || '',
        zipCode: updated.address?.zipCode || ''
      });
    } catch (err) {
      console.error('Profile update error:', err);
      toast({ title:'Error updating profile', description: err.response?.data?.message || 'Unknown error', status:'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box py={20} textAlign="center"><Text fontSize="xl">Loading profile...</Text></Box>;
  }
  return (
    <Box py={{ base: 4, md: 10 }} px={{ base: 2, md: 8 }} bg={pageBg} color={textColor}>
      <Container maxW={{ base: 'full', sm: 'sm', md: 'md' }} bg={containerBg} p={{ base: 4, md: 8 }} rounded="md" boxShadow="md">
        <Heading mb={4} color="green.500">Profile Settings</Heading>
        <form onSubmit={handleSubmit}>
          <Avatar src={form.avatar} size="xl" mb={4} />
          <FormControl mb={4}>
            <FormLabel>Profile Picture</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </FormControl>
          {/* Address Fields */}
          <FormControl mb={4}>
            <FormLabel>Street</FormLabel>
            <Input name="street" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>City</FormLabel>
            <Input name="city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>State</FormLabel>
            <Input name="state" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Zip Code</FormLabel>
            <Input name="zipCode" value={form.zipCode} onChange={e => setForm({...form, zipCode: e.target.value})} />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="green" width="full" isLoading={saving}>Save Changes</Button>
        </form>
        {/* History now on its own page (see /history) */}
      </Container>
    </Box>
  );
}
