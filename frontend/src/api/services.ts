import apiClient from './client';

export const authService = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await apiClient.post('/api/v1/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
  register: async (email: string, username: string, password: string) => {
    const response = await apiClient.post('/api/v1/register', { email, username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
  }
};

export const analyticsService = {
  getSummary: async () => {
    const response = await apiClient.get('/api/v1/analytics/summary');
    return response.data;
  },
  getByProvider: async () => {
    const response = await apiClient.get('/api/v1/analytics/by-provider');
    return response.data;
  },
  getByRegion: async () => {
    const response = await apiClient.get('/api/v1/analytics/by-region');
    return response.data;
  },
  getByType: async () => {
    const response = await apiClient.get('/api/v1/analytics/by-type');
    return response.data;
  },
  getTopExpensive: async () => {
    const response = await apiClient.get('/api/v1/analytics/top-expensive');
    return response.data;
  },
  getTrend: async () => {
    const response = await apiClient.get('/api/v1/analytics/trend');
    return response.data;
  }
};

export const resourceService = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/resources/');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/v1/resources/', data);
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/resources/${id}`);
  }
};
