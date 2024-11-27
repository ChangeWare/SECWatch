import Button from "@common/components/Button.tsx";
import {layoutStyles} from "@common/styles/components.ts";

export function HomeNav() {
  const navItems = ['Features', 'About', 'Contact'];

  return (
      <nav className="border-b border-main-blue/20">
        <div className={layoutStyles.navSection}>
          <div className={layoutStyles.flexBetween}>
            <div className="flex items-center">
              <span className="text-main-blue-light text-2xl font-bold">SECWatch</span>
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
              <Button>Get Started</Button>
              <Button variant="secondary">Login</Button>
            </div>
          </div>
        </div>
      </nav>
  );
}