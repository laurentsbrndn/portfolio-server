import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

/* ---------- Field selections: only what the frontend renders ---------- */

const profileSelect = {
  fullName: true,
  headline: true,
  bio: true,
  avatarUrl: true,
  resumeUrl: true,
  email: true,
  location: true,
  githubUrl: true,
  linkedinUrl: true,
  emailUrl: true,
} satisfies Prisma.ProfileSelect;

const educationSelect = {
  id: true,
  institution: true,
  degree: true,
  fieldOfStudy: true,
  gpa: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
  description: true,
} satisfies Prisma.EducationSelect;

const workSelect = {
  id: true,
  companyName: true,
  companyLogoUrl: true,
  role: true,
  employmentType: true,
  location: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
  description: true,
} satisfies Prisma.WorkExperienceSelect;

const skillSelect = {
  id: true,
  name: true,
  category: true,
  proficiencyLevel: true,
  iconUrl: true,
} satisfies Prisma.SkillSelect;

const projectSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  fullDescription: true,
  thumbnailUrl: true,
  demoUrl: true,
  repositoryUrl: true,
  isFeatured: true,
  images: {
    select: { id: true, imageUrl: true, caption: true },
    orderBy: { displayOrder: 'asc' },
  },
  skills: {
    select: { skill: { select: skillSelect } },
    orderBy: { skill: { displayOrder: 'asc' } },
  },
} satisfies Prisma.ProjectSelect;

const organizationSelect = {
  id: true,
  organizationName: true,
  role: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
  description: true,
} satisfies Prisma.OrganizationExperienceSelect;

const languageSelect = {
  id: true,
  name: true,
  proficiency: true,
} satisfies Prisma.LanguageSelect;

const certificationSelect = {
  id: true,
  title: true,
  issuingOrganization: true,
  credentialUrl: true,
  imageUrl: true,
  issueDate: true,
} satisfies Prisma.CertificationSelect;

/* ---------- Query ---------- */

const fetchPortfolio = async () => {
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
    prisma.profile.findFirst({ select: profileSelect, orderBy: { createdAt: 'asc' } }),
    prisma.education.findMany({
      select: educationSelect,
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    }),
    prisma.workExperience.findMany({
      select: workSelect,
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    }),
    prisma.project.findMany({
      select: projectSelect,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.organizationExperience.findMany({
      select: organizationSelect,
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    }),
    prisma.skill.findMany({ select: skillSelect, orderBy: { displayOrder: 'asc' } }),
    prisma.language.findMany({ select: languageSelect, orderBy: { displayOrder: 'asc' } }),
    prisma.certification.findMany({
      select: certificationSelect,
      orderBy: [{ displayOrder: 'asc' }, { issueDate: 'desc' }],
    }),
  ]);

  return {
    profile,
    // Decimal serializes to a string in JSON; expose a real number
    education: education.map(({ gpa, ...rest }) => ({ ...rest, gpa: gpa?.toNumber() ?? null })),
    workExperience,
    projects,
    organizationExperience,
    skills,
    languages,
    certifications,
  };
};

export type PortfolioPayload = Awaited<ReturnType<typeof fetchPortfolio>>;

/* ---------- In-memory cache with request de-duplication ---------- */

let cached: { data: PortfolioPayload; expiresAt: number } | null = null;
let pending: Promise<PortfolioPayload> | null = null;

export const getFullPortfolioData = async (): Promise<PortfolioPayload> => {
  const ttlMs = env.PORTFOLIO_CACHE_TTL * 1000;
  if (ttlMs === 0) return fetchPortfolio();

  if (cached && cached.expiresAt > Date.now()) return cached.data;

  // Concurrent requests share a single database round-trip
  pending ??= fetchPortfolio()
    .then((data) => {
      cached = { data, expiresAt: Date.now() + ttlMs };
      return data;
    })
    .catch((error: unknown) => {
      // Serve stale data rather than failing if the DB is temporarily down
      if (cached) {
        console.warn('Portfolio refresh failed; serving stale cache.', error);
        return cached.data;
      }
      throw error;
    })
    .finally(() => {
      pending = null;
    });

  return pending;
};

/** Call after modifying portfolio data (e.g. from a future admin endpoint). */
export const invalidatePortfolioCache = (): void => {
  cached = null;
};