'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_BOARDS = gql`
  query ($workspaceId: Float!) {
    boards(workspaceId: $workspaceId) {
      id
      title
    }
  }
`;

const CREATE_BOARD = gql`
  mutation ($title: String!, $workspaceId: Float!) {
    createBoard(title: $title, workspaceId: $workspaceId) {
      id
      title
    }
  }
`;

type Board = {
  id: number;
  title: string;
};

type GetBoardsResponse = {
  boards: Board[];
};

type CreateBoardResponse = {
  createBoard: Board;
};

type CreateBoardVars = {
  title: string;
  workspaceId: number;
};

export function useBoards(workspaceId: number) {
  const { data, loading, refetch } =
    useQuery<GetBoardsResponse>(GET_BOARDS, {
      variables: { workspaceId },
    });

  const [createBoardMutation] =
    useMutation<CreateBoardResponse, CreateBoardVars>(CREATE_BOARD);

  const createBoard = async (title: string) => {
    await createBoardMutation({
      variables: { title, workspaceId },
    });

    await refetch();
  };

  return {
    boards: data?.boards || [],
    loading,
    createBoard,
  };
}