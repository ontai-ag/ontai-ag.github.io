import '@/lib/axiosConfig';
import axios from 'axios';


// Настройка глобальных параметров axios
axios.defaults.headers.common['referrer-policy'] = 'strict-origin-when-cross-origin';
axios.defaults.withCredentials = true; // Включаем передачу куки для кросс-доменных запросов

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
}

const authService = {
  // Сохранение токена
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Получение токена
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Удаление токена
  removeToken: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Регистрация пользователя
  register: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post('/v1/users/register', {
        email,
        password
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при регистрации');
    }
  },

  // Вход пользователя
  signInWithPassword: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        '/v1/users/login',
        { email, password }
      );
      const { token, user } = response.data;
      authService.setToken(token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при входе');
    }
  },

  // Получение профиля текущего пользователя
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Не авторизован');
      }
      const response = await axios.get('/v1/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при получении профиля');
    }
  },

  // Выход пользователя
  logout: () => {
    authService.removeToken();
  },

  // Проверка аутентификации
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // Инициализация сервиса
  init: () => {
    const token = authService.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

export default authService;