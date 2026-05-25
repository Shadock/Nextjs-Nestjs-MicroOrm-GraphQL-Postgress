'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_ALL_WORKSPACES = gql`
  query {
    allWorkspaces {
      id
      name
      owner {
        id
        email
        username
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      email
      username
      role
    }
  }
`;

const ASSIGN_WORKSPACE = gql`
  mutation ($workspaceId: Float!, $userId: Float!) {
    assignWorkspaceToUser(workspaceId: $workspaceId, userId: $userId)
  }
`;

const CREATE_WORKSPACE = gql`
  mutation ($name: String!) {
    createWorkspace(name: $name) {
      id
      name
    }
  }
`;

const DELETE_WORKSPACE = gql`
  mutation ($workspaceId: Float!) {
    deleteWorkspace(workspaceId: $workspaceId)
  }
`;

export type AdminWorkspace = {
  id: number;
  name: string;
  owner: { id: number; email: string; username?: string };
};

export type AdminUser = {
  id: number;
  email: string;
  username?: string;
  role: string;
};

export function useAdmin() {
  const {
    data: wsData,
    loading: wsLoading,
    refetch: refetchWs,
  } = useQuery<{ allWorkspaces: AdminWorkspace[] }>(GET_ALL_WORKSPACES);

  const {
    data: usersData,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useQuery<{ allUsers: AdminUser[] }>(GET_ALL_USERS);

  const [assignMutation] = useMutation(ASSIGN_WORKSPACE);
  const [createMutation] = useMutation(CREATE_WORKSPACE);
  const [deleteMutation] = useMutation(DELETE_WORKSPACE);

  const assignWorkspace = async (workspaceId: number, userId: number) => {
    await assignMutation({ variables: { workspaceId, userId } });
    await refetchWs();
  };

  const createWorkspace = async (name: string) => {
    await createMutation({ variables: { name } });
    await refetchWs();
    await refetchUsers();
  };

  const deleteWorkspace = async (workspaceId: number) => {
    await deleteMutation({ variables: { workspaceId } });
    await refetchWs();
  };

  return {
    workspaces: wsData?.allWorkspaces || [],
    users: usersData?.allUsers || [],
    loading: wsLoading || usersLoading,
    assignWorkspace,
    createWorkspace,
    deleteWorkspace,
  };
}
