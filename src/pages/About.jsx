import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { assets } from '@/utils/AssetImport';

const AboutUs = () => {
  // Team members with provided details
  const teamMembers = [
    {
      name: 'Siddhartha Sarkar',
      email: 'operation@groovycafe.in',
      image: assets.team1,
    },
    { name: 'Umesh Shukla', email: 'admin@groovycafe.in', image: assets.team2 },
    {
      name: 'Niranjan Adhyaru',
      email: 'Niranjanadhyaru@gmail.com',
      image: assets.team3,
    },
    {
      name: 'Pradipbhai Patel',
      email: 'ppkachhadiya@gmail.com',
      image: assets.team4,
    },
  ];

  return (
    <Container maxWidth='lg' className='pt-20'>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 5,
          borderRadius: 3,
        }}
      >
        <Typography variant='h3' gutterBottom>
          About Us
        </Typography>
        <Typography variant='h6' color='text.secondary'>
          Learn more about who we are, our mission, and our vision.
        </Typography>
      </Box>

      {/* Mission, Vision, Values Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ textAlign: 'center', p: 2, boxShadow: 3, minHeight: 260 }}
          >
            <Avatar
              sx={{ bgcolor: '#FFD900', width: 56, height: 56, m: 'auto' }}
            >
              {/* Mission Icon */}
            </Avatar>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Our Mission
              </Typography>
              <Typography color='text.secondary'>
                To deliver innovative and quality Ready to eat and ready to cook
                food products to hotels, restaurants, cafes, caterers, and every
                home worldwide
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ textAlign: 'center', p: 2, boxShadow: 3, minHeight: 260 }}
          >
            <Avatar
              sx={{ bgcolor: '#FFD900', width: 56, height: 56, m: 'auto' }}
            >
              {/* Vision Icon */}
            </Avatar>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Our Vision
              </Typography>
              <Typography color='text.secondary'>
                To be the leading provider of exceptional services that inspire
                and connect people worldwide.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ textAlign: 'center', p: 2, boxShadow: 3, minHeight: 260 }}
          >
            <Avatar
              sx={{ bgcolor: '#FFD900', width: 56, height: 56, m: 'auto' }}
            >
              {/* Teamwork Icon */}
            </Avatar>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Our Values
              </Typography>
              <Typography color='text.secondary'>
                Integrity, collaboration, and commitment to excellence in all
                that we do.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Section */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant='h4' gutterBottom>
          Meet Our Team
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 4 }}>
          Our dedicated team works tirelessly to bring our vision to life.
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
                <Avatar
                  alt={member.name}
                  src={member.image}
                  sx={{ width: 100, height: 100, m: 'auto', mt: 2 }}
                />
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography color='text.secondary'>{member.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;
