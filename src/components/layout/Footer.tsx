
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
        { name: t('footer.product.aiAgents'), href: '/agents' },
        { name: t('footer.product.pricing'), href: '/pricing' },
        { name: t('footer.product.useCases'), href: '/use-cases' },
      ],
    },
    {
      title: t('footer.company.title'),
      links: [
        { name: t('footer.company.about'), href: '/about' },
        { name: t('footer.company.careers'), href: '/careers' },
        { name: t('footer.company.blog'), href: '/blog' },
        { name: t('footer.company.press'), href: '/press' },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { name: t('footer.resources.documentation'), href: '/docs' },
        { name: t('footer.resources.helpCenter'), href: '/help' },
        { name: t('footer.resources.community'), href: '/community' },
        { name: t('footer.resources.status'), href: '/status' },
      ],
    },
    {
      title: t('footer.legal.title'),
      links: [
        { name: t('footer.legal.privacy'), href: '/privacy' },
        { name: t('footer.legal.terms'), href: '/terms' },
        { name: t('footer.legal.security'), href: '/security' },
        { name: t('footer.legal.compliance'), href: '/compliance' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="font-medium text-lg">Oñtai</span>
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
            &copy; {currentYear} Oñtai. {t('footer.allRightsReserved')}
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
