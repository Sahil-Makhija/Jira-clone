import { getCurrentUser, getWorkspaceById } from "@/features/actions/server";
import { UpdateWorkspaceForm } from "@/features/components/workspaces/update-workspace-form";
import { redirect } from "next/navigation";

const WorkspaceIdSettingsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById({ workspaceId });
  if (!workspace) {
    redirect("/");
  }
  return (
    <div>
      <UpdateWorkspaceForm defaultValues={workspace} />
    </div>
  );
};
export default WorkspaceIdSettingsPage;
