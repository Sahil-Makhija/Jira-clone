import { redirect } from "next/navigation";

import { SignUpCard } from "@/features";
import { getCurrent } from "@/features/actions";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) return redirect("/");

  return <SignUpCard />;
};
export default SignUpPage;
