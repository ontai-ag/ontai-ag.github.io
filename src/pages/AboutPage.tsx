import React from 'react';
import { useTranslation } from 'react-i18next';
import AboutLayout from '@/components/about/AboutLayout';
import TeamMemberCard from '@/components/about/TeamMemberCard';
import { Button } from '@/components/ui/button'; // Assuming Button component is available
import { Link } from 'react-router-dom'; // For internal links

// Placeholder images - replace with actual paths or URLs
const syrymImage = '/images/syrym-placeholder.jpg'; // Replace with actual image path
const arsenImage = '/images/arsen-placeholder.jpg'; // Replace with actual image path

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <AboutLayout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {t('aboutPage.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('aboutPage.hero.missionStatement')}
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-primary italic mb-8">
            {t('aboutPage.hero.slogan')}
          </p>
        </section>

        {/* The Genesis & Our Name Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {t('aboutPage.genesis.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                {t('aboutPage.genesis.storyIntro')}
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                {t('aboutPage.genesis.tomorrowSchool')}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {t('aboutPage.genesis.startupGarage')}
              </p>
            </div>
            <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">{t('aboutPage.genesis.nameMeaningTitle')}</h3>
              <p className="text-muted-foreground mb-3">
                {t('aboutPage.genesis.nameOrigin')}
              </p>
              <p className="text-muted-foreground">
                {t('aboutPage.genesis.aiConnection')}
              </p>
            </div>
          </div>
        </section>

        {/* Meet The Trailblazers Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t('aboutPage.team.title')}
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            <TeamMemberCard 
              imageSrc={syrymImage} 
              nameKey="aboutPage.team.syrym.name"
              roleKey="aboutPage.team.syrym.role"
              descriptionKey="aboutPage.team.syrym.description"
              telegramLink="https://t.me/syrymjoli" // Replace with actual link
            />
            <TeamMemberCard 
              imageSrc={arsenImage} 
              nameKey="aboutPage.team.arsen.name"
              roleKey="aboutPage.team.arsen.role"
              descriptionKey="aboutPage.team.arsen.description"
              telegramLink="https://t.me/arsen_example" // Replace with actual link
            />
          </div>
        </section>

        {/* The Ontai Edge Section */}
        <section className="mb-16 md:mb-24 bg-muted/30 dark:bg-muted/50 py-12 md:py-16 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {t('aboutPage.edge.title')}
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground">
              <p>{t('aboutPage.edge.intro')}</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>{t('aboutPage.edge.point1')}</li>
                <li>{t('aboutPage.edge.point2')}</li>
                <li>{t('aboutPage.edge.point3')}</li>
                <li>{t('aboutPage.edge.pointOptimization')}</li> 
              </ul>
              <p>{t('aboutPage.edge.conclusion')}</p>
            </div>
          </div>
        </section>

        {/* Join Our Journey Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('aboutPage.join.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('aboutPage.join.description')}
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/careers">{t('aboutPage.join.careersButton')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">{t('aboutPage.join.contactButton')}</Link> 
            </Button>
          </div>
        </section>
      </div>
    </AboutLayout>
  );
};

export default AboutPage;

// Example i18n keys (to be added to your translation files e.g. en.json, ru.json):
/*
{
  "aboutPage": {
    "hero": {
      "title": "Ontai: Optimizing the Future with Artificial Intelligence",
      "missionStatement": "We are Ontai, a dynamic AI startup born from a passion for optimization and cutting-edge technology. We're building intelligent solutions to tackle complex challenges and drive progress.",
      "slogan": "Dreams Beyond the Box"
    },
    "genesis": {
      "title": "Our Spark & Name",
      "storyIntro": "The idea for Ontai was ignited by our shared drive for efficiency and innovation.",
      "tomorrowSchool": "As ambitious students at Tomorrow School (01edu), we are progressively studying AI, placing us at the forefront of modern technologies.",
      "startupGarage": "Our participation in the 4th cohort of Startup Garage by Astana Hub validates our potential and the viability of our vision.",
      "nameMeaningTitle": "The Meaning of Ontai",
      "nameOrigin": "Our name, Ontai, is no accident. We, the founders, Syrym and Arsen, are passionate about optimization – in everything we do. The word 'Ontai' originates from the Kazakh 'оңтайландыру' (optimization) and its short form 'Оңтай', which also means 'the best option' or 'optimal path'.",
      "aiConnection": "The 'ai' ending is our daily passion and focus: Artificial Intelligence. Thus, Ontai embodies our mission – to find the best, optimal solutions through the power of artificial intelligence."
    },
    "team": {
      "title": "Meet The Trailblazers",
      "telegramButton": "Connect on Telegram",
      "syrym": {
        "name": "Syrym [Last Name]",
        "role": "Co-founder & CTO / Lead AI Architect",
        "description": "Ontai's technical genius. With over 6 years in development, Syrym is deeply immersed in AI architecture and LLMs. His passion is turning complex algorithms into elegant, optimal solutions that change the world. A graduate of Tomorrow School, where he honed his skills to perfection."
      },
      "arsen": {
        "name": "Arsen [Last Name]",
        "role": "Co-founder & CEO / Strategy Lead",
        "description": "The driving force and strategic mind of Ontai. An MBA and 8+ years of business development experience help Arsen see global opportunities and build bridges between technology and the market, finding the best paths for growth. Together with Syrym, he charts Ontai's course to the pinnacles of the AI industry, studying at the progressive Tomorrow School."
      }
    },
    "edge": {
      "title": "The Ontai Edge (For Investors & Talent)",
      "intro": "Why is Ontai a bet on the future? We combine visionary leadership, deep technical expertise, and a relentless pursuit of optimization.",
      "point1": "Unique Team Synergy: A perfect blend of technical prowess (Syrym) and strategic business acumen (Arsen).",
      "point2": "Market Potential: Positioned in the rapidly growing AI sector with innovative solutions.",
      "point3": "Proven Traction: Validated by Astana Hub's Startup Garage, signaling strong potential.",
      "pointOptimization": "Philosophy of Optimization: Our name is our DNA. We strive for maximum efficiency and the creation of the best AI solutions, ensuring high returns on investment and client satisfaction.",
      "conclusion": "Investing in Ontai or joining our team means becoming part of the next big thing in AI."
    },
    "join": {
      "title": "Join Our Journey",
      "description": "Whether you're an investor looking for the next unicorn, or a talented individual eager to shape the future of AI, Ontai is where your ambitions can thrive.",
      "careersButton": "Explore Careers",
      "contactButton": "Get in Touch"
    }
  }
}
*/