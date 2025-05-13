// src/data/careers.ts

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string; // e.g., "Full-time", "Remote"
  description: string; // Short description for card and detailed page intro
  responsibilities: string[];
  qualifications: string[];
  niceToHave?: string[];
  benefits?: string[];
  datePosted: string; // ISO date string
  companyDescription?: string; // Optional: if different from a general one
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Marketing Specialist',
    slug: 'marketing-specialist',
    department: 'Marketing',
    location: 'Remote',
    employmentType: 'Full-time',
    description: 'Join our dynamic marketing team to drive growth through innovative digital strategies, compelling content, and data-driven insights. We are looking for a creative and analytical mind to enhance our brand presence and engage our target audience.',
    responsibilities: [
      'Develop and execute digital marketing campaigns across various channels (SEO/SEM, social media, email).',
      'Create engaging content for blogs, social media, and website.',
      'Analyze marketing data and campaign performance to optimize strategies.',
      'Manage and grow our online community.',
      'Collaborate with cross-functional teams to align marketing efforts with business goals.',
    ],
    qualifications: [
      'Proven experience as a Marketing Specialist or similar role.',
      'Solid knowledge of SEO/SEM, Google Analytics, and CRM software.',
      'Experience with content creation and social media marketing.',
      'Excellent communication and writing skills.',
      'Ability to work independently and manage multiple projects.',
    ],
    niceToHave: [
      'Experience in the AI or tech industry.',
      'Familiarity with marketing automation tools.',
      'Graphic design skills (e.g., Canva, Adobe Creative Suite).',
    ],
    benefits: [
      'Competitive salary and performance bonuses.',
      'Comprehensive health insurance (medical, dental, vision).',
      'Flexible working hours and remote work options.',
      'Opportunities for professional development and growth.',
      'A collaborative and innovative work environment.',
    ],
    datePosted: '2025-05-11T10:00:00Z',
    companyDescription: 'Ontai is a forward-thinking company dedicated to revolutionizing industries through cutting-edge AI solutions. We foster a culture of innovation, collaboration, and continuous learning, empowering our team to make a real impact.'
  },
  {
    id: '2',
    title: 'AI/LLM Programmer',
    slug: 'ai-llm-programmer',
    department: 'AI Research & Development',
    location: 'Hybrid (Office/Remote)',
    employmentType: 'Full-time',
    description: 'We are seeking a talented AI/LLM Programmer to contribute to the development, training, and integration of large language models. You will work on challenging projects at the forefront of AI, pushing the boundaries of what\'s possible.',
    responsibilities: [
      'Design, develop, and fine-tune large language models (LLMs).',
      'Implement and optimize algorithms for natural language processing (NLP) tasks.',
      'Work with Python, PyTorch, TensorFlow, and other relevant AI frameworks.',
      'Collaborate with researchers and engineers to integrate AI models into products.',
      'Stay up-to-date with the latest advancements in AI and LLM research.',
    ],
    qualifications: [
      'Strong programming skills in Python.',
      'Experience with machine learning frameworks like PyTorch or TensorFlow.',
      'Solid understanding of NLP concepts and techniques.',
      'Experience in training and deploying machine learning models.',
      'Master\'s or PhD in Computer Science, AI, or a related field, or equivalent practical experience.',
    ],
    niceToHave: [
      'Publications in top-tier AI conferences.',
      'Experience with MLOps and cloud platforms (AWS, GCP, Azure).',
      'Familiarity with transformer architectures and attention mechanisms.',
    ],
    benefits: [
      'Highly competitive salary and stock options.',
      'Opportunity to work on groundbreaking AI projects.',
      'Access to state-of-the-art computational resources.',
      'Generous budget for learning and development.',
      'Dynamic and stimulating research environment.',
    ],
    datePosted: '2025-05-20T09:00:00Z',
    companyDescription: 'Ontai is a forward-thinking company dedicated to revolutionizing industries through cutting-edge AI solutions. We foster a culture of innovation, collaboration, and continuous learning, empowering our team to make a real impact.'
  },
];