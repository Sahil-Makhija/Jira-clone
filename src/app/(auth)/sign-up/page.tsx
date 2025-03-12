import { redirect } from "next/navigation";

import { getCurrent } from "@/features/actions/server";
import { SignUpCard } from "@/features/components/auth";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");

  return <SignUpCard />;
};
export default SignUpPage;
