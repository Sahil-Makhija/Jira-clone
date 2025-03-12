import { redirect } from "next/navigation";

import { getCurrent } from "@/features/actions/server";
import { SignInCard } from "@/features/components/auth";

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");
  return <SignInCard />;
};
export default SignInPage;
