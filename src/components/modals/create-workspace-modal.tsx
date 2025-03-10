"use client";
import { CreateWorkspaceForm, useCreateWorkspaceModal } from "@/features";

import { ResponsiveModal } from "./responsice-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm underModal onCancel={close} />
    </ResponsiveModal>
  );
};
