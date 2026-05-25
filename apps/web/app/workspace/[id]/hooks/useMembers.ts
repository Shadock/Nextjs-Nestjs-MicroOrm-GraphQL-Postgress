'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_MEMBERS = gql`
  query ($workspaceId: Float!) {
    members(workspaceId: $workspaceId) {
      id
      role
      user {
        id
        email
        username
      }
    }
  }
`;

const INVITE_BY_EMAIL = gql`
  mutation ($workspaceId: Float!, $email: String!) {
    inviteToWorkspaceByEmail(workspaceId: $workspaceId, email: $email)
  }
`;

const MAKE_ADMIN = gql`
  mutation ($workspaceId: Float!, $userId: Float!) {
    makeAdmin(workspaceId: $workspaceId, userId: $userId)
  }
`;

type MemberUser = {
  id: number;
  email: string;
  username?: string;
};

export type Member = {
  id: number;
  role: 'ADMIN' | 'MEMBER';
  user: MemberUser;
};

type GetMembersResponse = {
  members: Member[];
};

export function useMembers(workspaceId: number) {
  const { data, loading, refetch } = useQuery<GetMembersResponse>(GET_MEMBERS, {
    variables: { workspaceId },
  });

  const [inviteMutation, { loading: inviting }] = useMutation(INVITE_BY_EMAIL);
  const [makeAdminMutation] = useMutation(MAKE_ADMIN);

  const inviteByEmail = async (email: string) => {
    await inviteMutation({ variables: { workspaceId, email } });
    await refetch();
  };

  const promoteToAdmin = async (userId: number) => {
    await makeAdminMutation({ variables: { workspaceId, userId } });
    await refetch();
  };

  return {
    members: data?.members || [],
    loading,
    inviting,
    inviteByEmail,
    promoteToAdmin,
  };
}
