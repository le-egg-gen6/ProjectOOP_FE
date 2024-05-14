import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Page404 = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      sx={{ width: "100%" }}
    >
      <Container maxWidth="sm" >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <ErrorOutlineIcon
            fontSize="large"
            color="error"
            sx={{ fontSize: '5rem', mb: 2 }}
          />
          <Typography variant="h1" gutterBottom>
            Oops!
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Sorry, the page you are looking for does not exist.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Go to Home Page
          </Button>
        </Box>
      </Container>
    </Box>
  );
};


export default Page404;