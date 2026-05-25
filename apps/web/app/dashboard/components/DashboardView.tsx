'use client';

import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';

export default function DashboardView() {
  const { memberships, loading, createWorkspace } = useWorkspaces();

  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    await createWorkspace(name);
    setName('');
  };

  if (loading) {
    return <p className="p-10">Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6">
          Mes Espaces de travail
        </h1>

        {/* Create workspace */}
        <div className="flex gap-2 mb-6">
          <div className="flex flex-col gap-1 flex-1">
            <Label.Root className="text-sm font-medium">
              Nom de l&apos;espace de travail
            </Label.Root>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Mon Projet"
            />
          </div>
          <button
            onClick={handleCreate}
            className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800"
          >
            Créer
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {memberships.map((m) => (
            <a
              key={m.id}
              href={`/workspace/${m.workspace.id}`}
              className="p-4 border rounded-md hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span>{m.workspace.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                m.role === 'ADMIN'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {m.role === 'ADMIN' ? 'Admin' : 'Membre'}
              </span>
            </a>
          ))}

          {memberships.length === 0 && (
            <p className="text-gray-500 text-sm">
              Aucun espace de travail pour l&apos;instant
            </p>
          )}
        </div>

      </div>
    </div>
  );
}