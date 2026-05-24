'use client';

import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';

export default function DashboardView() {
  const { workspaces, loading, createWorkspace } = useWorkspaces();

  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    await createWorkspace(name);
    setName('');
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">
          Your Workspaces
        </h1>

        {/* Create workspace */}
        <div className="flex gap-2 mb-6">
          <div className="flex flex-col gap-1 flex-1">
            <Label.Root className="text-sm font-medium">
              Workspace name
            </Label.Root>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="My Project"
            />
          </div>

          <button
            onClick={handleCreate}
            className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800"
          >
            Create
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {workspaces.map((ws) => (
            <a
              key={ws.id}
              href={`/workspace/${ws.id}`}
              className="p-4 border rounded-md hover:bg-gray-50 transition"
            >
              {ws.name}
            </a>
          ))}

          {workspaces.length === 0 && (
            <p className="text-gray-500 text-sm">
              No workspaces yet
            </p>
          )}
        </div>

      </div>
    </div>
  );
}