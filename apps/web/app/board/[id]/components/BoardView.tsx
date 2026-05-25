'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { useTasks } from '../hooks/useTasks';
import TaskColumn from './TaskColumn';

export default function BoardView({ boardId }: { boardId: number }) {
  const {
    tasks,
    loading,
    title,
    setTitle,
    description,
    setDescription,
    handleCreate,
    creating,
    moveTask,
  } = useTasks(boardId);

  if (loading) {
    return <p className="p-10">Chargement des tâches...</p>;
  }

  const todo = tasks.filter((t) => t.status === 'TODO');
  const doing = tasks.filter((t) => t.status === 'DOING');
  const done = tasks.filter((t) => t.status === 'DONE');
  const waiting = tasks.filter((t) => t.status === 'WAITING');

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId;
    const newOrder = result.destination.index;

    await moveTask(taskId, newStatus, newOrder);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">Board</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la tâche..."
          className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optionnelle)..."
          className="border px-3 py-2 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 rounded-md"
        >
          {creating ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto">

          <TaskColumn title="Rédigé" tasks={todo} droppableId="TODO" />
          <TaskColumn title="En cours" tasks={doing} droppableId="DOING" />
          <TaskColumn title="Finalisé" tasks={done} droppableId="DONE" />
          <TaskColumn title="En attente" tasks={waiting} droppableId="WAITING" />

        </div>
      </DragDropContext>

    </div>
  );
}