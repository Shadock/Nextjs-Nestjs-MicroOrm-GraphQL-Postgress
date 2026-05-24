'use client';

import { useParams } from 'next/navigation';
import WorkspaceView from './components/WorkspaceView';

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = Number(params.id);

  return <WorkspaceView workspaceId={workspaceId} />;
}