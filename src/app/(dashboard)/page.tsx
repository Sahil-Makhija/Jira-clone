import { redirect } from "next/navigation";

import { getCurrent } from "@/features/actions/server";
import { CreateWorkspaceForm } from "@/features/components/workspaces";

// TODO: Redirect to the workspace page if logged in

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="">
      <CreateWorkspaceForm />
    </div>
  );
}
