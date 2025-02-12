import { redirect } from "next/navigation";

import { SignInCard } from "@/features";
import { getCurrent } from "@/features/actions";

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");
  return <SignInCard />;
};
export default SignInPage;
