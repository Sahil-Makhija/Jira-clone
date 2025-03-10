import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features";

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
