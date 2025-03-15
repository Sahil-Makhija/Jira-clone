import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/actions/server";
import { SignUpCard } from "@/features/components/auth";

const SignUpPage = async () => {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  return <SignUpCard />;
};
export default SignUpPage;
