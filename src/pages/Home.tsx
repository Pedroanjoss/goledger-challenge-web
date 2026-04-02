import { Typography, Container, Box } from '@mui/material';

export function Home() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          GoLedger TV Catalog
        </Typography>
        <Typography variant="body1">
          Bem-vindo ao catálogo de séries baseado em Blockchain.
        </Typography>
      </Box>
    </Container>
  );
}