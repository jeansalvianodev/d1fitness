import { describe, it, expect } from 'vitest';
import { apiClient } from './apiClient';

describe('API Client', () => {
  it('deve ter configurações básicas definidas', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults).toBeDefined();
  });
});
