'use client';

import { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminView() {
  const { workspaces, users, loading, assignWorkspace, createWorkspace, deleteWorkspace } = useAdmin();

  const [newWsName, setNewWsName] = useState('');
  const [selectedWs, setSelectedWs] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const handleCreateWorkspace = async () => {
    if (!newWsName.trim()) return;
    await createWorkspace(newWsName.trim());
    setNewWsName('');
  };

  const handleAssign = async () => {
    if (!selectedWs || !selectedUser) return;
    await assignWorkspace(Number(selectedWs), Number(selectedUser));
    setSelectedWs('');
    setSelectedUser('');
  };

  if (loading) return <p className="p-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Panneau Administrateur</h1>

        {/* Create workspace */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Créer un espace de travail</h2>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label.Root className="text-sm font-medium">Nom</Label.Root>
              <input
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Nouveau workspace"
              />
            </div>
            <button
              onClick={handleCreateWorkspace}
              className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800"
            >
              Créer
            </button>
          </div>
        </div>

        {/* Assign workspace to user */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Affecter un espace de travail</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <Label.Root className="text-sm font-medium">Espace de travail</Label.Root>
              <select
                value={selectedWs}
                onChange={(e) => setSelectedWs(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">-- Choisir --</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <Label.Root className="text-sm font-medium">Utilisateur</Label.Root>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">-- Choisir --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username || u.email} ({u.email})</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedWs || !selectedUser}
              className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              Affecter
            </button>
          </div>
        </div>

        {/* All workspaces list */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tous les espaces de travail ({workspaces.length})</h2>
          <div className="flex flex-col gap-2">
            {workspaces.map((ws) => (
              <div key={ws.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <span className="font-medium">{ws.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    — Propriétaire : {ws.owner.username || ws.owner.email}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/workspace/${ws.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => deleteWorkspace(ws.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            {workspaces.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun espace de travail</p>
            )}
          </div>
        </div>

        {/* All users list */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tous les utilisateurs ({users.length})</h2>
          <div className="flex flex-col gap-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <span className="font-medium">{u.username || u.email}</span>
                  <span className="text-gray-500 text-sm ml-2">({u.email})</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  u.role === 'GLOBAL_ADMIN'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.role === 'GLOBAL_ADMIN' ? 'Super Admin' : 'Utilisateur'}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun utilisateur</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
