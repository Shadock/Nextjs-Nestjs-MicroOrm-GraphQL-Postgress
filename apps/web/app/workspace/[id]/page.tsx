'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import WorkspaceView from './components/WorkspaceView';

const CHECK_MEMBERSHIP = gql`
  query ($workspaceId: Float!) {
    members(workspaceId: $workspaceId) {
      id
    }
  }
`;

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = Number(params.id);

  const { error, loading } = useQuery(CHECK_MEMBERSHIP, {
    variables: { workspaceId },
  });

  useEffect(() => {
    if (!loading && error) {
      router.push('/dashboard');
    }
  }, [error, loading, router]);

  if (loading) return <p className="p-10">Chargement...</p>;
  if (error) return null;

  return <WorkspaceView workspaceId={workspaceId} />;
}
