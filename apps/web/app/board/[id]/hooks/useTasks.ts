'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';

const GET_TASKS = gql`
  query ($boardId: Float!) {
    tasks(boardId: $boardId) {
      id
      title
      status
      order
    }
  }
`;

const CREATE_TASK = gql`
  mutation ($title: String!, $description: String!, $boardId: Float!) {
    createTask(title: $title, description: $description, boardId: $boardId) {
      id
      title
      status
      order
    }
  }
`;

const MOVE_TASK = gql`
  mutation ($taskId: Float!, $status: TaskStatus!, $order: Float!) {
    moveTask(taskId: $taskId, status: $status, order: $order) {
      id
      status
      order
    }
  }
`;

type Task = {
  id: number;
  title: string;
  status: 'TODO' | 'DOING' | 'DONE' | 'WAITING';
  order: number;
};

type GetTasksResponse = {
  tasks: Task[];
};

type CreateTaskResponse = {
  createTask: Task;
};

type CreateTaskVariables = {
  title: string;
  description: string;
  boardId: number;
};

export function useTasks(boardId: number) {
  const { data, loading, refetch } = useQuery<GetTasksResponse>(GET_TASKS, {
    variables: { boardId },
  });

  const [createTaskMutation, { loading: creating }] =
    useMutation<CreateTaskResponse, CreateTaskVariables>(CREATE_TASK);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;

    await createTaskMutation({
      variables: { title, description, boardId },
    });

    setTitle('');
    setDescription('');
    await refetch();
  };
  
const [moveTaskMutation] = useMutation(MOVE_TASK);

  const moveTask = async (
    taskId: number,
    status: 'TODO' | 'DOING' | 'DONE' | 'WAITING',
    order: number
  ) => {
    await moveTaskMutation({
      variables: { taskId, status, order },
    });

    await refetch();
  };



  return {
    tasks: data?.tasks || [],
    loading,
    creating,  
    title,
    setTitle,
    description,
    setDescription,
    handleCreate,
    moveTask,
  };
}