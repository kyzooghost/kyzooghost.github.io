export const WORK_TYPE = {
  caseStudy: 'case-study',
  externalArtifact: 'external-artifact',
  earlierWriting: 'earlier-writing',
  project: 'project',
  hackathon: 'hackathon',
} as const;

export const WORK_TYPE_VALUES = [
  WORK_TYPE.caseStudy,
  WORK_TYPE.externalArtifact,
  WORK_TYPE.earlierWriting,
  WORK_TYPE.project,
  WORK_TYPE.hackathon,
] as const;

export type WorkType = (typeof WORK_TYPE_VALUES)[number];

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  [WORK_TYPE.caseStudy]: 'Case study',
  [WORK_TYPE.externalArtifact]: 'External artifact',
  [WORK_TYPE.earlierWriting]: 'Technical writing',
  [WORK_TYPE.project]: 'Project',
  [WORK_TYPE.hackathon]: 'Hackathon',
};

export const WORK_LINK_LABEL: Record<WorkType, string> = {
  [WORK_TYPE.caseStudy]: 'Read case study →',
  [WORK_TYPE.externalArtifact]: 'Read externally ↗',
  [WORK_TYPE.earlierWriting]: 'Read on Medium ↗',
  [WORK_TYPE.project]: 'View project →',
  [WORK_TYPE.hackathon]: 'View project ↗',
};
