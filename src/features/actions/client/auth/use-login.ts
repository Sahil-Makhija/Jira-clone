"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Login successful");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Login failed");
    },
  });

  return mutation;
};
