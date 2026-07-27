export const checkHealth = async (): Promise<string> => {
  const { API_URL } = await import('@/constants/api');
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check falló (${response.status})`);
  }
  return response.text();
};
