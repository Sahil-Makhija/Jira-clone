"use client";

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({ json, param });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite Code changed successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to join workspace.");
    },
  });

  return mutation;
};
