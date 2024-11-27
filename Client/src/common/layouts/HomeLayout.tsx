import { HomeNav } from '@common/components/Nav/HomeNav';
import { HomeFooter } from '@common/components/Footer/HomeFooter';
import { PropsWithChildren } from 'react';
import {Outlet} from "react-router-dom";

export default function HomeLayout(props: PropsWithChildren) {
    console.log(props.children);
  return (
    <div className="min-h-screen bg-main-blue-dark">
      <HomeNav />
        <main>
            <Outlet />
        </main>
      <HomeFooter />
    </div>
  );
};