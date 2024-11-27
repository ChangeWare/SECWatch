import Button from "@common/components/Button.tsx";
import {glassStyles, layoutStyles} from "@common/styles/components.ts";
import {Logo} from "@common/components/Logo.tsx";

export function HomeNav() {
  const navItems = ['Features', 'About', 'Contact'];

  return (
      <nav className={`fixed w-full top-0 z-50 ${glassStyles.container} bg-white/5`}>
        <div className={layoutStyles.navSection}>
          <div className={layoutStyles.flexBetween}>
            <div className="flex items-center">
              <Logo height={40} className="hover:transform hover:scale-105 transition"/>
            </div>

            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                  <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-main-blue-light hover:text-main-orange-light transition"
                  >
                    {item}
                  </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="primary">Get Started</Button>
              <Button variant="secondary">Login</Button>
            </div>
          </div>
        </div>
      </nav>
  );
}