// src/pages/JobDetailPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CareersLayout from '@/components/layout/CareersLayout';
import { jobs, Job } from '@/data/careers'; // Mock data and type
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Briefcase, CalendarDays, Building } from 'lucide-react';

const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const job = jobs.find((j) => j.slug === slug);

  if (!job) {
    return (
      <CareersLayout>
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('careers.detail.notFound.title', 'Вакансия не найдена')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('careers.detail.notFound.message', 'К сожалению, мы не смогли найти запрошенную вакансию.')}
          </p>
          <Button asChild variant="outline">
            <Link to="/careers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('careers.detail.backToList', 'Назад к списку вакансий')}
            </Link>
          </Button>
        </div>
      </CareersLayout>
    );
  }

  const mailtoLink = `mailto:Syrym.joli@gmail.com?subject=Application%20for%20${encodeURIComponent(job.title)}`;

  return (
    <CareersLayout>
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
              <Link to="/careers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('careers.detail.backToList', 'Назад к списку вакансий')}
              </Link>
            </Button>
          </div>

          <article className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
            <header className="mb-6 border-b pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{job.title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center"><Building className="h-4 w-4 mr-1.5" />{job.department}</span>
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" />{job.location}</span>
                <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" />{job.employmentType}</span>
                <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" />{t('careers.detail.postedOn', 'Опубликовано')}: {new Date(job.datePosted).toLocaleDateString()}</span>
              </div>
            </header>

            {job.companyDescription && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.aboutCompany', 'О компании')}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{job.companyDescription}</p>
              </section>
            )}

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.jobDescription', 'Описание вакансии')}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.responsibilities', 'Обязанности')}</h2>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-4">
                {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.qualifications', 'Требования')}</h2>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-4">
                {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>

            {job.niceToHave && job.niceToHave.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.niceToHave', 'Будет плюсом')}</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-4">
                  {job.niceToHave.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </section>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-3">{t('careers.detail.whatWeOffer', 'Что мы предлагаем')}</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-4">
                  {job.benefits.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </section>
            )}

            <footer className="mt-8 pt-6 border-t">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <a href={mailtoLink}>
                  <Mail className="h-5 w-5 mr-2" />
                  {t('careers.detail.applyNow', 'Откликнуться')}
                </a>
              </Button>
            </footer>
          </article>
        </div>
      </div>
    </CareersLayout>
  );
};

export default JobDetailPage;