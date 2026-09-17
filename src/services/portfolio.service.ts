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
    prisma.education.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.workExperience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.project.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        images: true,
        skills: { include: { skill: true } },
      },
    }),
    prisma.organizationExperience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.language.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.certification.findMany({ orderBy: { issueDate: 'desc' } }),
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