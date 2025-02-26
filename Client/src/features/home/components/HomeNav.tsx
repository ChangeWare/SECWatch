import Button from "@common/components/Button.tsx";
import { layoutStyles } from "@common/styles/components.ts";
import {Logo} from "@common/components/Logo.tsx";
import {paths} from "@routes/paths.ts";
import { useAuth } from "@features/auth";
import {Link} from "react-router-dom";

interface HomeNavItem {
    name: string;
    href: string;
}

export function HomeNav() {
  const navItems: HomeNavItem[] = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'About',
      href: '/about'
    },
    {
      name: 'Contact',
      href: '/contact'
    }
  ];

  const { isAuthenticated } = useAuth();

  return (
      <nav className={`fixed w-full top-0 z-50 bg-surface/80 backdrop-blur-sm rounded-2xl border border-white/10 `}>
        <div className={layoutStyles.navSection}>
          <div className={layoutStyles.flexBetween}>
            <div className="flex items-center -ml-12">
              <Logo height={40} className="hover:transform hover:scale-105 transition"/>
            </div>

            <div className="hidden md:flex space-x-8 pt-1.5">
              {navItems.map((item) => (
                  <Link
                      key={item.href}
                      to={`${item.href}`}
                      className="text-secondary hover:text-info transition"
                  >
                    {item.name}
                  </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                  <>
                    <Button variant="primary" to={paths.dashboard.default}>Dashboard</Button>
                    <Button variant="info" to={paths.auth.logout}>Logout</Button>
                  </>
              ) : (
                  <>
                    <Button variant="primary" to={paths.dashboard.default}>Get Started</Button>
                    <Button variant="info" to={paths.auth.login}>Login</Button>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}