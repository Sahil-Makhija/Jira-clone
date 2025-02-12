import { redirect } from "next/navigation";

import { UserButton } from "@/features";
import { getCurrent } from "@/features/actions";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="">
      <UserButton />
    </div>
  );
}
