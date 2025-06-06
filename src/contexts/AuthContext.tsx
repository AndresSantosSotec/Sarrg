// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Tipos para el usuario
export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}

// Tipo para la cuenta de FitCoins
export interface FitcoinAccount {
  id: number;
  colaborator_id: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

// Tipo para el colaborador
export interface Collaborator {
  id: number;
  user_id: number;
  nombre: string;
  sexo: string;
  telefono: string;
  direccion: string;
  ocupacion: string;
  area: string;
  peso: string;
  altura: string;
  tipo_sangre: string;
  alergias: string;
  padecimientos: string;
  indice_masa_corporal: string;
  nivel_asignado: string;
  photo_path: string | null;
  photo_url: string | null;
  coin_fits: number;
  created_at: string;
  updated_at: string;
  user: User;
  fitcoin_account: FitcoinAccount;
}

// Respuesta de login
export interface LoginResponse {
  user: User;
  token: string;
}

// Forma del contexto
interface AuthContextData {
  user: User | null;
  collaborator: Collaborator | null;
  isCollaborator: boolean;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
  changePassword: (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => Promise<void>;
  updatePhoto: (photoUri: string) => Promise<string>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  collaborator: null,
  isCollaborator: false,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshData: async () => {},
  changePassword: async () => {},
  updatePhoto: async () => ''
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar colaborador
  const loadCollaborator = async () => {
    try {
      const { data } = await api.get<{ collaborator: Collaborator }>(
        '/app/collaborator'
      );
      setCollaborator(data.collaborator);
    } catch (err) {
      setCollaborator(null);
    }
  };

  // Nueva función para refrescar datos
  const refreshData = async () => {
    setLoading(true);
    try {
      // Refetch user
      const resUser = await api.get<{ user: User }>('/app/user');
      setUser(resUser.data.user);
      // Refetch collaborator
      await loadCollaborator();
    } finally {
      setLoading(false);
    }
  };

  // Efecto de arranque: valida token, carga user y collaborator
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('auth_token');
        if (t) {
          setToken(t);
          api.defaults.headers.common['Authorization'] = `Bearer ${t}`;

          // 1) Carga datos de usuario
          const resUser = await api.get<{ user: User }>('/app/user');
          setUser(resUser.data.user);

          // 2) Carga datos de colaborador asociado
          await loadCollaborator();
        }
      } catch (e) {
        console.error('Error validando token:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Función de login: guarda token, carga user y collaborator
  const login = async (email: string, password: string) => {
    const res = await api.post<LoginResponse>('/app/login', {
      email,
      password,
    });
    const { user: u, token: t } = res.data;

    // 1) Guarda token localmente
    await AsyncStorage.setItem('auth_token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);

    // 2) Setea usuario
    setUser(u);

    // 3) Carga colaborador
    await loadCollaborator();
  };

  // Función de logout: borra todo
  const logout = async () => {
    try {
      await api.post('/app/logout');
    } catch {
      // ignorar fallos de servidor
    }
    await AsyncStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    setCollaborator(null);
  };

  // Cambiar contraseña
  const changePassword = async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => {
    await api.post('/app/user/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    });
  };

  // Actualizar foto de perfil
  const updatePhoto = async (photoUri: string) => {
    const form = new FormData();
    form.append('photo', {
      uri: photoUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    const { data } = await api.post<{ photo_url: string }>(
      '/app/user/photo',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Refresca collaborator para que tome la nueva URL
    await refreshData();
    return data.photo_url;
  };

  const isCollaborator = !!collaborator;

  return (
    <AuthContext.Provider
      value={{
        user,
        collaborator,
        isCollaborator,
        token,
        loading,
        login,
        logout,
        refreshData,
        changePassword,
        updatePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
