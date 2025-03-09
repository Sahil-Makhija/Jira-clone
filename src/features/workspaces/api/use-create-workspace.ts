"use client";

import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;
type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  return mutation;
};
