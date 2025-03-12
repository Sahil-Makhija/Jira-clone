import { redirect } from "next/navigation";

import { getCurrent } from "@/features/actions/server";
import { CreateWorkspaceForm } from "@/features/components/workspaces";

const WorkspaceCreatePage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
