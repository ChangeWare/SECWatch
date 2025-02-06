import {layoutStyles, textStyles} from "@common/styles/components.ts";

interface FooterItem {
    name: string;
    href: string;
}

export function HomeFooter() {

  const footerItems = [
        {
            name: 'Privacy',
            href: '#'
        },
        {
            name: 'Terms',
            href: '#'
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
                  <a
                      key={item.href}
                      href={item.href}
                      className="text-secondary hover:text-info transition"
                  >
                    {item.name}
                  </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}