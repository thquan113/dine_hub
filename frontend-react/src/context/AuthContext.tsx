import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUser} from '../store/slices/userSlice';
import axiosInstance from '../config/axios/config';
export const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfor, setUserInfor] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/auth/login', { email, password });
      const token = res.data.access_token;
      const user = res.data.user;
      setUserToken(token);
      await AsyncStorage.setItem('userInfor', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.log(`Login error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_c: string) => {
    if (password !== password_c) {
      console.log('Mật khẩu xác nhận ko trùng khớp');
      return;
    }
  
    const data = {
      user_name: name,
      email: email,
      password: password,
      password_confirmation: password_c,
    };

    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/auth/register', data);
      const token = res.data.access_token;
      const user = res.data.user;

      setUserToken(token);
      await AsyncStorage.setItem('userInfor', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', token);
      
    } catch (error: any) {
      if (error.response) {
        console.log(`Registration failed: ${error.response.data.message}`);
      } else {
        console.log(`Registration error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const logout = () => {
    setIsLoading(true);
    setUserToken(null); 
    AsyncStorage.removeItem('userInfor');
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      let userInfor = await AsyncStorage.getItem('userInfor');
      if (userInfor) {
        userInfor = JSON.parse(userInfor);
        setUserToken(userToken);
        setUserInfor(userInfor);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`Login error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{login, logout, register,isLoading, userToken, userInfor}}>
      {children}
    </AuthContext.Provider>
  );
};
