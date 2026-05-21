import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    const profileData = response.data.data ? response.data.data.user : response.data;
                    const userData = { ...profileData, accessToken: token, token };
                    setUser(userData);
                    localStorage.setItem('userInfo', JSON.stringify(userData));
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const result = response.data.data ? response.data.data : response.data;
            const userData = { ...result.user, ...result, token: result.accessToken };
            
            setUser(userData);
            setToken(result.accessToken);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const result = response.data.data ? response.data.data : response.data;
            const userData = { ...result.user, ...result, token: result.accessToken };
            
            setUser(userData);
            setToken(result.accessToken);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
