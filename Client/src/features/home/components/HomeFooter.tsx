import {layoutStyles, textStyles} from "@common/styles/components.ts";
import {Link} from "react-router-dom";

interface FooterItem {
    name: string;
    href: string;
}

export function HomeFooter() {

  const footerItems = [
        {
            name: 'Privacy',
            href: '/privacy'
        },
        {
            name: 'Terms',
            href: '/terms'
        },
        {
            name: 'Contact',
            href: '/contact'
        }
    ];


  return (
      <footer className="border-t border-info/20">
        <div className={layoutStyles.section}>
          <div className="flex flex-col md:flex-row justify-between items-center py-8">
            <div className={`${textStyles.paragraph} mb-4 md:mb-0`}>
              © 2025 SECWatch. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {footerItems.map((item) => (
                  <Link
                      key={item.href}
                      to={item.href}
                      className="text-secondary hover:text-info transition"
                  >
                    {item.name}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}