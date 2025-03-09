import { redirect } from "next/navigation";

import { SignInCard } from "@/features";
import { getCurrent } from "@/features/auth/actions";

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");
  return <SignInCard />;
};
export default SignInPage;
