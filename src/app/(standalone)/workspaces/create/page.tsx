import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/actions/server";
import { CreateWorkspaceForm } from "@/features/components/workspaces";

export const dynamic = "force-dynamic";

const WorkspaceCreatePage = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
