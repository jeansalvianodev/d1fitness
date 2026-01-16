import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import type { Venda } from '../types';
import { formatarMoeda, formatarData, traduzirStatus, getCorStatus } from '../utils/formatters';

interface VendaCardProps {
  venda: Venda;
  onEnviarNF: (venda: Venda) => void;
  onVerHistorico?: (venda: Venda) => void;
  loading?: boolean;
}

export const VendaCard: React.FC<VendaCardProps> = ({ 
  venda, 
  onEnviarNF, 
  onVerHistorico,
  loading = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Header com código e status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6" component="div" fontWeight="bold">
              #{venda.codigo || venda.codigoVenda}
            </Typography>
          </Box>
          <Chip
            label={traduzirStatus(venda.statusEnvioNF)}
            color={getCorStatus(venda.statusEnvioNF)}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        <Divider />

        {/* Informações da venda */}
        <Box display="flex" flexDirection="column" gap={1.5} mt={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Cliente:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {venda.cliente}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Data:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatarData(venda.data)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoneyIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Valor:
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary">
              {formatarMoeda(venda.valor)}
            </Typography>
          </Box>
        </Box>

        {/* Botão de ação */}
        <Box mt="auto" pt={2} display="flex" flexDirection="column" gap={1}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<SendIcon />}
            onClick={() => onEnviarNF(venda)}
            disabled={loading}
            size={isMobile ? 'medium' : 'large'}
          >
            Enviar NF
          </Button>
          
          {onVerHistorico && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<HistoryIcon />}
              onClick={() => onVerHistorico(venda)}
              disabled={loading}
              size="small"
            >
              Ver Histórico
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
