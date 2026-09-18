import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFullPortfolioData = async () => {
  const [
    profile,
    education,
    workExperience,
    projects,
    organizationExperience,
    skills,
    languages,
    certifications,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.education.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
    prisma.workExperience.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
    prisma.project.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        skills: { include: { skill: true } },
      },
    }),
    prisma.organizationExperience.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
    prisma.skill.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
    prisma.language.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
    prisma.certification.findMany({ 
      orderBy: { displayOrder: 'asc' } 
    }),
  ]);

  return {
    profile,
    education,
    workExperience,
    projects,
    organizationExperience,
    skills,
    languages,
    certifications,
  };
};