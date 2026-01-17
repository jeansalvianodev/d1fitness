import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  InputAdornment,
  TextField,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { useVendas } from '../context/VendasContext';
import { VendaCard } from './VendaCard';
import { EnviarNotaFiscalModal } from './EnviarNotaFiscalModal';
import { HistoricoEnviosModal } from './HistoricoEnviosModal';
import { EstatisticasVendas } from './EstatisticasVendas';
import { Loading } from './Loading';
import { ErrorMessage } from './ErrorMessage';
import type { Venda, NotaFiscal } from '../types';
import { enviosNotaFiscalService } from '../services/enviosNotaFiscalService';
import { toast } from 'react-toastify';

export const VendasList = () => {
  const { vendas, loading, error, carregarVendas, buscarNotaFiscal, atualizarStatusVenda } =
    useVendas();
  const [modalOpen, setModalOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [notaFiscalSelecionada, setNotaFiscalSelecionada] = useState<NotaFiscal | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarVendas();
  }, [carregarVendas]);

  const handleEnviarNF = async (venda: Venda) => {
    setVendaSelecionada(venda);

    const codigoNF = venda.codigoNotaFiscal;
    if (!codigoNF) {
      toast.error('Código da nota fiscal não encontrado');
      return;
    }

    const notaFiscal = await buscarNotaFiscal(codigoNF);
    if (!notaFiscal) {
      toast.error('Nota fiscal não encontrada para esta venda');
      return;
    }

    setNotaFiscalSelecionada(notaFiscal);
    setModalOpen(true);
  };

  const handleConfirmarEnvio = async (email: string) => {
    if (!notaFiscalSelecionada || !vendaSelecionada) return;

    const codigoNF = notaFiscalSelecionada.codigoNotaFiscal;
    if (!codigoNF) {
      toast.error('Código da nota fiscal não encontrado');
      return;
    }

    const codigoVenda = vendaSelecionada.codigo || vendaSelecionada.codigoVenda;

    setEnviando(true);
    try {
      await enviosNotaFiscalService.enviar({
        codigoNotaFiscal: codigoNF,
        email: email,
      });

      if (codigoVenda) {
        atualizarStatusVenda(codigoVenda, 'enviado');
      }
      toast.success('Nota fiscal enviada com sucesso!');
    } catch (err: any) {
      if (codigoVenda) {
        atualizarStatusVenda(codigoVenda, 'erro');
      }
      const errorMessage = err?.response?.data?.message || 'Erro ao enviar nota fiscal';
      toast.error(errorMessage);
      throw err;
    } finally {
      setEnviando(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setVendaSelecionada(null);
    setNotaFiscalSelecionada(null);
  };

  const handleVerHistorico = async (venda: Venda) => {
    setVendaSelecionada(venda);

    const codigoNF = venda.codigoNotaFiscal;
    if (!codigoNF) {
      toast.error('Código da nota fiscal não encontrado');
      return;
    }

    const notaFiscal = await buscarNotaFiscal(codigoNF);
    if (!notaFiscal) {
      toast.error('Nota fiscal não encontrada para esta venda');
      return;
    }

    setNotaFiscalSelecionada(notaFiscal);
    setHistoricoOpen(true);
  };

  const handleCloseHistorico = () => {
    setHistoricoOpen(false);
    setVendaSelecionada(null);
    setNotaFiscalSelecionada(null);
  };

  const vendasFiltradas = vendas.filter(
    (venda) => {
      const codigo = venda.codigo?.toString() || venda.codigoVenda || '';
      return venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        codigo.includes(searchTerm);
    }
  );

  if (loading && vendas.length === 0) {
    return <Loading message="Carregando vendas..." />;
  }

  if (error && vendas.length === 0) {
    return <ErrorMessage message={error} onRetry={carregarVendas} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Vendas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie e envie notas fiscais das suas vendas
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={carregarVendas}
            disabled={loading}
          >
            Atualizar
          </Button>
        </Box>

        {/* Barra de busca */}
        <Box mt={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por cliente ou código da venda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      {/* Estatísticas */}
      {vendas.length > 0 && <EstatisticasVendas vendas={vendas} />}

      {/* Lista de vendas */}
      {vendasFiltradas.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'Nenhuma venda encontrada' : 'Nenhuma venda cadastrada'}
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {vendasFiltradas.map((venda, index) => (
              <VendaCard
                key={`${venda.codigo || venda.codigoVenda}-${index}`}
                venda={venda}
                onEnviarNF={handleEnviarNF}
                onVerHistorico={handleVerHistorico}
                loading={enviando}
              />
          ))}
        </Box>
      )}

      {/* Modal de envio */}
      <EnviarNotaFiscalModal
        open={modalOpen}
        onClose={handleCloseModal}
        venda={vendaSelecionada}
        notaFiscal={notaFiscalSelecionada}
        onEnviar={handleConfirmarEnvio}
      />

      {/* Modal de histórico */}
      <HistoricoEnviosModal
        open={historicoOpen}
        onClose={handleCloseHistorico}
        codigoNotaFiscal={notaFiscalSelecionada?.codigoNotaFiscal || null}
      />
    </Container>
  );
};
