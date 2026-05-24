'use client';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import Cookies from 'js-cookie';


const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

type LoginResponse = {
  login: string;
};

type LoginVariables = {
  email: string;
  password: string;
};

export function useLogin() {
  const [loginMutation, { loading, error }] =
    useMutation<LoginResponse, LoginVariables>(LOGIN);

  const login = async (email: string, password: string) => {
    const res = await loginMutation({
      variables: { email, password },
    });

    const token = res.data?.login;

    if (token) {      
      Cookies.set('token', token, {
        expires: 7,
        secure: false,
        sameSite: 'lax',
      });

    }

    return token;
  };

  return { login, loading, error };
}   