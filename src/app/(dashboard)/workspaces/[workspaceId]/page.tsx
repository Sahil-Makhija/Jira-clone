import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/actions/server";

const WorkspaceIdPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { workspaceId } = await params;
  return <div>{workspaceId}</div>;
};
export default WorkspaceIdPage;
