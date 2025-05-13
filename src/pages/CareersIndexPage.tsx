// src/pages/CareersIndexPage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import CareersLayout from '@/components/layout/CareersLayout';
import JobCard from '@/components/careers/JobCard';
import { jobs } from '@/data/careers'; // Mock data
import { Button } from '@/components/ui/button'; // Assuming Button is used for something, or can be removed

const CareersIndexPage: React.FC = () => {
  const { t } = useTranslation(); // For potential future translations

  return (
    <CareersLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-4">
            {t('careers.index.title', 'Карьера в Ontai')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t('careers.index.intro', 'Присоединяйтесь к нашей инновационной команде и помогите формировать будущее ИИ. Мы ищем талантливых специалистов, готовых решать сложные задачи и расти вместе с нами.')}
          </p>
        </header>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {t('careers.index.noOpenings', 'В настоящее время открытых вакансий нет. Загляните позже!')}
            </p>
          </div>
        )}

        <section className="mt-16 md:mt-24 py-12 bg-muted/50 dark:bg-muted/20 rounded-lg">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              {t('careers.index.whyOntai.title', 'Почему Ontai?')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {t('careers.index.whyOntai.item1.title', 'Инновационные проекты')}
                </h3>
                <p className="text-muted-foreground">
                  {t('careers.index.whyOntai.item1.description', 'Работайте над передовыми ИИ-решениями, которые меняют индустрии.')}
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {t('careers.index.whyOntai.item2.title', 'Команда экспертов')}
                </h3>
                <p className="text-muted-foreground">
                  {t('careers.index.whyOntai.item2.description', 'Сотрудничайте с ведущими специалистами в области искусственного интеллекта и разработки.')}
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {t('careers.index.whyOntai.item3.title', 'Возможности роста')}
                </h3>
                <p className="text-muted-foreground">
                  {t('careers.index.whyOntai.item3.description', 'Мы инвестируем в развитие наших сотрудников, предлагая обучение и карьерный рост.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CareersLayout>
  );
};

export default CareersIndexPage;