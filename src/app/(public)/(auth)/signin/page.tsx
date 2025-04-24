import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audapp SignIn Page",
  description: "Audapp SignIn Page",
};

export default function SignIn() {
  return <SignInForm />;
}

