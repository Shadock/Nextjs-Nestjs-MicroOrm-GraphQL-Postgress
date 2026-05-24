'use client';

import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useBoards } from '../hooks/useBoards';

export default function WorkspaceView({ workspaceId }: { workspaceId: number }) {
  const { boards, loading, createBoard } = useBoards(workspaceId);

  const [title, setTitle] = useState('');

  const handleCreate = async () => {
    if (!title) return;
    await createBoard(title);
    setTitle('');
  };

  if (loading) return <p className="p-10">Loading boards...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6">
          Boards
        </h1>

        <div className="flex gap-2 mb-6">
          <div className="flex flex-col gap-1 flex-1">
            <Label.Root className="text-sm font-medium">
              Board name
            </Label.Root>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Todo Board"
            />
          </div>

          <button
            onClick={handleCreate}
            className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {boards.map((board) => (
            <a
              key={board.id}
              href={`/board/${board.id}`}
              className="p-4 bg-gray-50 rounded-lg border hover:shadow transition"
            >
              {board.title}
            </a>
          ))}

          {boards.length === 0 && (
            <p className="text-gray-500 text-sm">
              No boards yet
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
