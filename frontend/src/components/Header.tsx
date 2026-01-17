import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../assets/d1fitness_logo.jpg';

export const Header = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <img src={logo} alt="D1FITNESS" style={{ marginRight: 16, height: 40 }} />
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            D1FITNESS
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Sistema de Gestão de Notas Fiscais
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
