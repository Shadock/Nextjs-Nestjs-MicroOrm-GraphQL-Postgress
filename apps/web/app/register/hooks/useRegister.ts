'use client';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      id
      email
    }
  }
`;

type RegisterResponse = {
  register: {
    id: number;
    email: string;
  };
};

type RegisterVariables = {
  email: string;
  password: string;
};

export function useRegister() {

const [registerMutation, { loading, error }] =
  useMutation<RegisterResponse, RegisterVariables>(REGISTER);

  const register = async (email: string, password: string) => {
    const res = await registerMutation({
      variables: { email, password },
    });

    return res.data?.register;
  };

  return { register, loading, error };
}