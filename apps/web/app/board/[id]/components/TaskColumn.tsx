'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';

type Task = {
  id: number;
  title: string;
};

type Props = {
  title: string;
  tasks: Task[];
  droppableId: string;
};

export default function TaskColumn({ title, tasks, droppableId }: Props) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-100 p-4 rounded-lg w-72"
        >
          <h2 className="font-semibold mb-4">{title}</h2>

          <div className="flex flex-col gap-2">
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-3 rounded shadow"
                  >
                    {task.title}
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}