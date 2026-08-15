import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { AlertCircle } from 'lucide-react';

export const Login = () => {
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthModal('login');
    navigate('/', { replace: true });
  }, []);

  return null;
};

export const Signup = () => {
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthModal('signup');
    navigate('/', { replace: true });
  }, []);

  return null;
};
