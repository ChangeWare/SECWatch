import {layoutStyles, textStyles} from "@common/styles/components.ts";

export function HomeFooter() {
  const footerItems = [
      'Privacy',
      'Terms',
      'Contact'
  ];

  return (
      <footer className="border-t border-main-blue/20">
        <div className={layoutStyles.section}>
          <div className="flex flex-col md:flex-row justify-between items-center py-8">
            <div className={`${textStyles.paragraph} mb-4 md:mb-0`}>
              © 2024 SECWatch. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {footerItems.map((item) => (
                  <a
                      key={item}
                      href="#"
                      className="text-main-blue-light hover:text-main-orange-light transition"
                  >
                    {item}
                  </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}