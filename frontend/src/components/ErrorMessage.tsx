import { Box, Alert, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={3}
      p={3}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        {message}
      </Alert>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          Tentar Novamente
        </Button>
      )}
    </Box>
  );
};
