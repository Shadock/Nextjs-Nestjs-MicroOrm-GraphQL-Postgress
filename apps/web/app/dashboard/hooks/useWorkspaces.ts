'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_WORKSPACES = gql`
  query {
    workspaces {
      id
      name
    }
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

type Workspace = {
  id: number;
  name: string;
};

type GetWorkspacesResponse = {
  workspaces: Workspace[];
};

type CreateWorkspaceResponse = {
  createWorkspace: Workspace;
};

type CreateWorkspaceVariables = {
  name: string;
};

export function useWorkspaces() {
  const { data, loading, refetch } =
    useQuery<GetWorkspacesResponse>(GET_WORKSPACES);

  const [createWorkspaceMutation] =
    useMutation<CreateWorkspaceResponse, CreateWorkspaceVariables>(
      CREATE_WORKSPACE
    );

  const createWorkspace = async (name: string) => {
    await createWorkspaceMutation({
      variables: { name },
    });

    await refetch(); // refresh list
  };

  return {
    workspaces: data?.workspaces || [],
    loading,
    createWorkspace,
  };
}