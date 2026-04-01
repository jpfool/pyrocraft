import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Products
export const getProducts = (category?: string, search?: string, sort?: string) =>
  api.get('/api/products', {
    params: {
      category: category !== 'all' ? category : undefined,
      search,
      sort_by: sort
    }
  });

export const getProduct = (id: number) =>
  api.get(`/api/products/${id}`);

// Orders
export const createOrder = (orderData: any) =>
  api.post('/api/orders/', orderData);

export const getOrder = (orderNumber: string) =>
  api.get(`/api/orders/${orderNumber}`);

export const trackOrder = (orderNumber: string) =>
  api.get(`/api/orders/${orderNumber}/tracking`);

export const trackOrdersByPhone = (phone: string) =>
  api.get(`/api/orders/phone/${phone}/tracking`);

// Uploads
export const uploadProductImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/uploads/product-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
