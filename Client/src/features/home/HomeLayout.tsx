import { HomeNav } from '@features/home/components/HomeNav.tsx';
import { HomeFooter } from '@features/home/components/HomeFooter.tsx';
import { PropsWithChildren } from 'react';
import {Outlet} from "react-router-dom";

export default function HomeLayout(props: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
        <HomeNav />
        <main className="pt-20">
            <Outlet/>
        </main>
        <HomeFooter/>
    </div>
  );
};