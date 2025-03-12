import { redirect } from "next/navigation";

import { getCurrentUser, getWorkspaces } from "@/features/actions/server";

export default async function Home() {
  const user = await getCurrentUser();
  const workspaces = await getWorkspaces();

  if (!user || !workspaces) {
    redirect("/sign-in");
  } else if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
