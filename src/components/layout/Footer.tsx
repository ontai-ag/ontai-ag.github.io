
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { cn } from '@/lib/utils';

const Footer = () => {
  const { t } = useTranslation(); // Initialize t function
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: t('footer.product.title'),
      links: [
        { name: t('footer.product.marketplace'), href: '/marketplace' },
        // { name: t('footer.product.aiAgents'), href: '/agents' },
        { name: t('footer.product.pricing'), href: '/pricing' },
        // { name: t('footer.product.useCases'), href: '/use-cases' },
      ],
    },
    {
      title: t('footer.company.title'),
      links: [
        { name: t('footer.company.about'), href: '/about' },
        // { name: t('footer.company.careers'), href: '/careers' },
        { name: t('footer.company.blog'), href: '/blog' },
        // { name: t('footer.company.press'), href: '/press' },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { name: t('footer.resources.documentation'), href: '/docs' },
        { name: t('footer.resources.helpCenter'), href: '/help' },
        // { name: t('footer.resources.community'), href: '/community' },
        // { name: t('footer.resources.status'), href: '/status' },
      ],
    },
    // {
    //   title: t('footer.legal.title'),
    //   links: [
    //     { name: t('footer.legal.privacy'), href: '/privacy' },
    //     { name: t('footer.legal.terms'), href: '/terms' },
    //     { name: t('footer.legal.security'), href: '/security' },
    //     { name: t('footer.legal.compliance'), href: '/compliance' },
    //   ],
    // },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src="79949da3-4f51-4906-b982-61fa265a04f6.png" alt="Ontai Logo" className="h-10" />
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {/* Social links commented out */}
              <a href="https://www.linkedin.com/company/o%C3%B1tai" className="text-gray-400 hover:text-gray-500 transition-colors">
                <span className="sr-only">{t('footer.linkedIn')}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/ontai.kz" className="text-gray-400 hover:text-gray-500 transition-colors">
                <span className="sr-only">{t('footer.instagram')}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://t.me/ontai_kz" className="text-gray-400 hover:text-gray-500 transition-colors">
                <span className="sr-only">{t('footer.telegram')}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.3 1.4.14 1.2.87l-2.67 12.58c-.22.99-.87 1.23-1.73.74l-4.82-3.56-2.32 2.23c-.25.24-.47.45-.87.45z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Ontai. {t('footer.allRightsReserved')}
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              {t('footer.termsOfService')}
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              {t('footer.cookiePolicy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
