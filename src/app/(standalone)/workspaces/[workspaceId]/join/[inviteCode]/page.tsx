import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, getWorkspaceById } from "@/features/actions/server";
import { PageError, PageLoader } from "@/components/shared";
import { JoinWorkspaceForm } from "@/features/components/workspaces";

const WorkspaceIdJoinPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string; inviteCode: string }>;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { workspaceId } = await params;
  const workspace = await getWorkspaceById({ workspaceId });
  if (!workspace) {
    return <PageError message="Workspace not found." />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="w-full lg:max-w-xl">
        <JoinWorkspaceForm initialValues={{ name: workspace.name }} />
      </div>
    </Suspense>
  );
};
export default WorkspaceIdJoinPage;
