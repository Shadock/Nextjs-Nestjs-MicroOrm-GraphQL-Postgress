'use client';

import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useBoards } from '../hooks/useBoards';
import { useMembers } from '../hooks/useMembers';

export default function WorkspaceView({ workspaceId }: { workspaceId: number }) {
  const { boards, loading: boardsLoading, createBoard } = useBoards(workspaceId);
  const { members, loading: membersLoading, inviting, inviteByEmail, promoteToAdmin } = useMembers(workspaceId);

  const [title, setTitle] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');

  const handleCreate = async () => {
    if (!title) return;
    await createBoard(title);
    setTitle('');
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteError('');
    try {
      await inviteByEmail(inviteEmail);
      setInviteEmail('');
    } catch {
      setInviteError('Impossible d\'inviter cet utilisateur.');
    }
  };

  const isAdmin = members.some((m) => m.role === 'ADMIN');

  if (boardsLoading) return <p className="p-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Boards section */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h1 className="text-2xl font-semibold mb-6">Boards</h1>

          <div className="flex gap-2 mb-6">
            <div className="flex flex-col gap-1 flex-1">
              <Label.Root className="text-sm font-medium">Nom du board</Label.Root>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Mon Board"
              />
            </div>
            <button
              onClick={handleCreate}
              className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800"
            >
              Créer
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
              <p className="text-gray-500 text-sm">Aucun board pour l&apos;instant</p>
            )}
          </div>
        </div>

        {/* Members section */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Membres</h2>

          {membersLoading ? (
            <p className="text-gray-500 text-sm">Chargement des membres...</p>
          ) : (
            <div className="flex flex-col gap-2 mb-6">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <span className="font-medium">{m.user.username || m.user.email}</span>
                    <span className="text-gray-500 text-sm ml-2">({m.user.email})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      m.role === 'ADMIN'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {m.role === 'ADMIN' ? 'Admin' : 'Membre'}
                    </span>
                    {isAdmin && m.role !== 'ADMIN' && (
                      <button
                        onClick={() => promoteToAdmin(m.user.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Promouvoir admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-gray-500 text-sm">Aucun membre</p>
              )}
            </div>
          )}

          {/* Invite by email */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label.Root className="text-sm font-medium">Inviter par email</Label.Root>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="utilisateur@exemple.com"
              />
            </div>
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="h-[42px] mt-auto bg-black text-white px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {inviting ? 'Invitation...' : 'Inviter'}
            </button>
          </div>
          {inviteError && (
            <p className="text-red-500 text-sm mt-2">{inviteError}</p>
          )}
        </div>

      </div>
    </div>
  );
}
