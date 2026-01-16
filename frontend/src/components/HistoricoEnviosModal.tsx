import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import EmailIcon from '@mui/icons-material/Email';
import type { EnvioNotaFiscal } from '../types';
import { enviosNotaFiscalService } from '../services/enviosNotaFiscalService';
import { formatarDataHora } from '../utils/formatters';

interface HistoricoEnviosModalProps {
  open: boolean;
  onClose: () => void;
  codigoNotaFiscal: string | number | null;
}

export const HistoricoEnviosModal: React.FC<HistoricoEnviosModalProps> = ({
  open,
  onClose,
  codigoNotaFiscal,
}) => {
  const [envios, setEnvios] = useState<EnvioNotaFiscal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && codigoNotaFiscal) {
      carregarHistorico();
    }
  }, [open, codigoNotaFiscal]);

  const carregarHistorico = async () => {
    if (!codigoNotaFiscal) return;

    setLoading(true);
    setError('');
    try {
      const data = await enviosNotaFiscalService.getByNotaFiscal(codigoNotaFiscal);
      setEnvios(data);
    } catch (err) {
      setError('Erro ao carregar histórico de envios');
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'enviado':
        return 'success';
      case 'erro':
        return 'error';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'enviado':
        return 'Enviado';
      case 'erro':
        return 'Erro';
      case 'pendente':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <HistoryIcon color="primary" />
            <Typography variant="h6">Histórico de Envios</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && envios.length === 0 && (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              Nenhum envio registrado para esta nota fiscal.
            </Typography>
          </Box>
        )}

        {!loading && !error && envios.length > 0 && (
          <List>
            {envios.map((envio, index) => (
              <React.Fragment key={envio.id}>
                {index > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight="medium">
                          {envio.emailDestino}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(envio.status)}
                        color={getStatusColor(envio.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      <strong>Data:</strong> {envio.dataEnvio ? formatarDataHora(envio.dataEnvio) : 'N/A'}
                    </Typography>

                    {envio.mensagemErro && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {envio.mensagemErro}
                      </Alert>
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
