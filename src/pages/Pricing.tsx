import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: 'Ontai Starter',
      price: '$5',
      frequency: t('pricing.monthly'),
      description: t('pricing.starter.description'),
      features: [
        t('pricing.starter.feature1'),
        t('pricing.starter.feature2'),
        t('pricing.starter.feature3'),
      ],
      cta: t('pricing.starter.cta'),
    },
    {
      name: 'Ontai Pro',
      price: '$9',
      frequency: t('pricing.monthly'),
      description: t('pricing.pro.description'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
      ],
      cta: t('pricing.pro.cta'),
      popular: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow page-transition">
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                {t('pricing.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 md:max-w-2xl mx-auto">
                {t('pricing.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border ${plan.popular ? 'border-primary ring-2 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {plan.popular && (
                    <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      {t('pricing.popular')}
                    </span>
                  )}
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400"> / {plan.frequency}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;