export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const formatarData = (data: string): string => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(data));
  } catch {
    return data;
  }
};

export const formatarDataHora = (data: string): string => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data));
  } catch {
    return data;
  }
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const traduzirStatus = (status?: 'pendente' | 'enviado' | 'erro'): string => {
  const statusMap = {
    pendente: 'Pendente',
    enviado: 'Enviado',
    erro: 'Erro',
  };
  return status ? statusMap[status] : 'Não enviado';
};

export const getCorStatus = (
  status?: 'pendente' | 'enviado' | 'erro'
): 'default' | 'success' | 'error' | 'warning' => {
  const coresMap = {
    pendente: 'warning' as const,
    enviado: 'success' as const,
    erro: 'error' as const,
  };
  return status ? coresMap[status] : 'default';
};
