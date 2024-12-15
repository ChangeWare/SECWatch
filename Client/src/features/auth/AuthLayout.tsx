import AuthFooter from "@features/auth/components/AuthFooter.tsx";
import { PropsWithChildren } from "react";
import {Outlet} from "react-router-dom";

export default function AuthLayout(props: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#023047]">
        <main>
            <Outlet />
        </main>
      <AuthFooter />
    </div>
  );
}