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
    handleCreate,
    creating,
    moveTask,
  } = useTasks(boardId);

  if (loading) {
    return <p className="p-10">Loading tasks...</p>;
  }

  const todo = tasks.filter((t) => t.status === 'TODO');
  const doing = tasks.filter((t) => t.status === 'DOING');
  const done = tasks.filter((t) => t.status === 'DONE');

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

      <div className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 rounded-md"
        >
          {creating ? 'Adding...' : 'Add'}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6">

          <TaskColumn title="Todo" tasks={todo} droppableId="TODO" />
          <TaskColumn title="Doing" tasks={doing} droppableId="DOING" />
          <TaskColumn title="Done" tasks={done} droppableId="DONE" />

        </div>
      </DragDropContext>

    </div>
  );
}