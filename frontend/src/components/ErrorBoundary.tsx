import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
          bgcolor="#f5f5f5"
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Ops! Algo deu errado
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ocorreu um erro inesperado na aplicação.
            </Typography>
            {this.state.error && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#ffebee',
                  mb: 3,
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2" color="error">
                  {this.state.error.toString()}
                </Typography>
              </Paper>
            )}
            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Recarregar Aplicação
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
