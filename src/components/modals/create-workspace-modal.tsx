"use client";

import { useCreateWorkspaceModal } from "@/features/hooks/workspaces";
import { CreateWorkspaceForm } from "@/features/components/workspaces";

import { ResponsiveModal } from "./responsive-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm underModal onCancel={close} />
    </ResponsiveModal>
  );
};
