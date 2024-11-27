import AuthFooter from "features/auth/components/AuthFooter";
import { PropsWithChildren } from "react";

export default function AuthLayout(props: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#023047]">
        <main>
            {props.children}
        </main>
      <AuthFooter />
    </div>
  );
}