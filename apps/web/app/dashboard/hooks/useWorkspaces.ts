'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_MY_MEMBERSHIPS = gql`
  query {
    myWorkspaceMemberships {
      id
      role
      workspace {
        id
        name
      }
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

type Membership = {
  id: number;
  role: 'ADMIN' | 'MEMBER';
  workspace: {
    id: number;
    name: string;
  };
};

type GetMembershipsResponse = {
  myWorkspaceMemberships: Membership[];
};

type CreateWorkspaceResponse = {
  createWorkspace: { id: number; name: string };
};

type CreateWorkspaceVariables = {
  name: string;
};

export function useWorkspaces() {
  const { data, loading, refetch } =
    useQuery<GetMembershipsResponse>(GET_MY_MEMBERSHIPS);

  const [createWorkspaceMutation] =
    useMutation<CreateWorkspaceResponse, CreateWorkspaceVariables>(
      CREATE_WORKSPACE
    );

  const createWorkspace = async (name: string) => {
    await createWorkspaceMutation({
      variables: { name },
    });

    await refetch();
  };

  return {
    memberships: data?.myWorkspaceMemberships || [],
    loading,
    createWorkspace,
  };
}
