import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/actions/server";
import { SignInCard } from "@/features/components/auth";

const SignInPage = async () => {
  const user = await getCurrentUser();
  if (user) return redirect("/");
  return <SignInCard />;
};
export default SignInPage;
