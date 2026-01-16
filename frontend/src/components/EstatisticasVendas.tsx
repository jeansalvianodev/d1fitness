import { Paper, Box, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import type { Venda } from '../types';
import { formatarMoeda } from '../utils/formatters';

interface EstatisticasVendasProps {
  vendas: Venda[];
}

export const EstatisticasVendas: React.FC<EstatisticasVendasProps> = ({ vendas }) => {
  const totalVendas = vendas.length;
  const valorTotal = vendas.reduce((acc, venda) => acc + venda.valor, 0);
  const enviados = vendas.filter((v) => v.statusEnvioNF === 'enviado').length;
  const pendentes = vendas.filter((v) => !v.statusEnvioNF || v.statusEnvioNF === 'pendente').length;
  const erros = vendas.filter((v) => v.statusEnvioNF === 'erro').length;

  const estatisticas = [
    {
      titulo: 'Total de Vendas',
      valor: totalVendas,
      icon: ShoppingCartIcon,
      color: '#1976d2',
    },
    {
      titulo: 'Valor Total',
      valor: formatarMoeda(valorTotal),
      icon: ShoppingCartIcon,
      color: '#2e7d32',
    },
    {
      titulo: 'NF Enviadas',
      valor: enviados,
      icon: CheckCircleIcon,
      color: '#2e7d32',
    },
    {
      titulo: 'Pendentes',
      valor: pendentes,
      icon: PendingIcon,
      color: '#ed6c02',
    },
    {
      titulo: 'Com Erro',
      valor: erros,
      icon: ErrorIcon,
      color: '#d32f2f',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2,
        mb: 3,
      }}
    >
      {estatisticas.map((stat) => {
        const Icon = stat.icon;
        return (
          <Paper
            key={stat.titulo}
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
              <Box
                sx={{
                  bgcolor: `${stat.color}15`,
                  p: 1.5,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon sx={{ color: stat.color, fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" fontSize={12}>
                  {stat.titulo}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stat.valor}
                </Typography>
              </Box>
            </Paper>
        );
      })}
    </Box>
  );
};
