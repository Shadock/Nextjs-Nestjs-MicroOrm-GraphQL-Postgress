'use client';

import { useParams } from 'next/navigation';
import BoardView from './components/BoardView';

export default function BoardPage() {
  const params = useParams();

  const boardId = Number(params.id);

  return <BoardView boardId={boardId} />;
}
