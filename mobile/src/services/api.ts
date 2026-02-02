/**
 * API клиент для мобильного приложения
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // API Gateway

export const api = {
  async getProjects(userId: string) {
    const response = await axios.get(`${API_URL}/projects`, {
      params: { userId }
    });
    return response.data;
  },

  async getProject(projectId: string) {
    const response = await axios.get(`${API_URL}/projects/${projectId}`);
    return response.data;
  },

  async createProject(data: any) {
    const response = await axios.post(`${API_URL}/projects`, data);
    return response.data;
  },

  async updateProject(projectId: string, data: any) {
    const response = await axios.put(`${API_URL}/projects/${projectId}`, data);
    return response.data;
  },

  async deleteProject(projectId: string) {
    await axios.delete(`${API_URL}/projects/${projectId}`);
  }
};

