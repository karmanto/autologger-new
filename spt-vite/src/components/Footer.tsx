import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Instagram as IgIcon } from 'lucide-react';
import { SiYoutube, SiTiktok, SiFacebook, SiLinkedin } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import 'flag-icons/css/flag-icons.min.css';

const Footer: React.FC = () => {
  const { t, language } = useLanguage(); 
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const packageLinks = [
    { key: 'jbiLink', label: t('jbiLink'), filter: { search: 'james bond', category: 'all' } },
    { key: 'phiPhiLink', label: t('phiPhiLink'), filter: { search: 'Phi', category: 'all' } },
    { key: 'rentalLink', label: t('rentalLink'), filter: { search: 'rental', category: 'all' } },
    { key: 'tourLink', label: t('tourLink'), filter: { search: 'guide', category: 'all' } },
    { key: 'similianLink', label: t('similianLink'), filter: { search: 'similan', category: 'all' } },
  ];

  const companyLinks = [
    { key: 'privacyPolicyLink', label: t('privacyPolicy'), href: '/Kebijakan Privasi - SPT.pdf' },
    ...(language === 'ru' ? [{ key: 'paymentMethodLink', label: t('paymentMethod'), href: '/Russian Payment.pdf' }] : []),
  ];

  const handlePackageClick = (filterParams: { search: string; category: string }) => {
    sessionStorage.setItem('tourFilterParams', JSON.stringify(filterParams));
    navigate('/tours');
  };

  const handleCompanyLinkClick = (href: string) => {
    if (href.endsWith('.pdf')) {
      window.open(href, '_blank');
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div itemScope itemType="https://schema.org/Organization">
            <h2 className="text-xl font-bold mb-4" itemProp="name">Simbolon Phuket Tour</h2>
            <p className="text-gray-400 mb-4" itemProp="description">{t('footerTagline')}</p>
            <div className="flex space-x-4" itemProp="sameAs">
              <a
                href="https://www.instagram.com/SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('followInstagram')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IgIcon size={20} />
              </a>
              <a
                href="https://www.youtube.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('subscribeYoutube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiYoutube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('followTiktok')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiTiktok size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/197Mwm5CWn/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('subscribeYoutube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiFacebook size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-rahman-simbolon-455814346"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('subscribeYoutube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiLinkedin size={20} />
              </a>
            </div>
            <ul className="mt-3">
              {companyLinks.map(item => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCompanyLinkClick(item.href)
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t('packages')}</h2>
            <ul className="space-y-2">
              {packageLinks.map(item => (
                <li key={item.key}>
                  <a
                    href="/tours"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePackageClick(item.filter);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t('contact')}</h2>
            <ul className="space-y-4" itemScope itemType="https://schema.org/TravelAgency">
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6281363878631" className="text-gray-400 hover:text-white transition-colors" itemProp="telephone">
                  (+62) 813-6387-8631
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6285275106059" className="text-gray-400 hover:text-white transition-colors">
                  (+66) 62 617 2623
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6282138161130" className="text-gray-400 hover:text-white transition-colors">
                  (+66) 80 380 8057
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="mailto:simbolonphukettour@gmail.com" className="text-gray-400 hover:text-white transition-colors" itemProp="email">
                  simbolonphukettour@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t('address')}</h2>
            <ul className="space-y-4" itemScope itemType="https://schema.org/PostalAddress">
              <li className="flex items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fi fi-th mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Thailand" />
                <span className="text-gray-400" itemProp="streetAddress">
                  30 Baan Sukhothai Building 2, Ramkhamhaeng Soi. 30/1, Yaek 2, Huamark, Bangkapi, Bangkok, Thailand 10240
                </span>
              </li>
              <li className="flex items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fi fi-id mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Indonesia" />
                <span className="text-gray-400" itemProp="streetAddress">
                  Jl. Keramat Indah No.9, Medan Tenggara, Kec. Medan Denai, Kota Medan, Sumatera Utara 20228
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('allRightsReserved').replace('2025', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
