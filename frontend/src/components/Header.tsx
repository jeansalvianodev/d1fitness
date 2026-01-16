import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export const Header = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <ReceiptLongIcon sx={{ mr: 2, fontSize: 32 }} />
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
