import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Audapp.cl",
  description: "Audapp.cl SignUp Page",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
