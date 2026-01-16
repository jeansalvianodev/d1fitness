import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { validarEmail } from '../utils/formatters';
import type { Venda, NotaFiscal } from '../types';

interface EnviarNotaFiscalModalProps {
  open: boolean;
  onClose: () => void;
  venda: Venda | null;
  notaFiscal: NotaFiscal | null;
  onEnviar: (email: string) => Promise<void>;
}

export const EnviarNotaFiscalModal: React.FC<EnviarNotaFiscalModalProps> = ({
  open,
  onClose,
  venda,
  notaFiscal,
  onEnviar,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnviar = async () => {
    if (!email.trim()) {
      setError('Por favor, informe um email');
      return;
    }

    if (!validarEmail(email)) {
      setError('Por favor, informe um email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onEnviar(email);
      handleClose();
    } catch (err) {
      setError('Erro ao enviar nota fiscal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon color="primary" />
          <Typography variant="h6">Enviar Nota Fiscal</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {venda && (
          <Box mb={3} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informações da Venda
            </Typography>
            <Typography variant="body2">
              <strong>Código:</strong> {venda.codigo || venda.codigoVenda}
            </Typography>
            <Typography variant="body2">
              <strong>Cliente:</strong> {venda.cliente}
            </Typography>
            {notaFiscal && (
              <Typography variant="body2">
                <strong>NF:</strong> {notaFiscal.numeroNF} - Série: {notaFiscal.serie}
              </Typography>
            )}
          </Box>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Email do destinatário"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error || 'Informe o email para envio da nota fiscal'}
          disabled={loading}
          placeholder="exemplo@email.com"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleEnviar}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
