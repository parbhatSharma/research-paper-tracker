export type ResearchDomain =
  | 'Computer Science'
  | 'Biology'
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Social Sciences';

export type ReadingStage =
  | 'Abstract Read'
  | 'Introduction Done'
  | 'Methodology Done'
  | 'Results Analyzed'
  | 'Fully Read'
  | 'Notes Completed';

export type ImpactScore = 'High Impact' | 'Medium Impact' | 'Low Impact' | 'Unknown';

export interface Paper {
  id: string;
  title: string;
  firstAuthor: string;
  domain: ResearchDomain;
  stage: ReadingStage;
  citationCount: number;
  impact: ImpactScore;
  dateAdded: string;
}

export type DateFilter = 'This Week' | 'This Month' | 'Last 3 Months' | 'All Time';
export type SortField = 'citationCount' | 'dateAdded' | 'title';
export type SortOrder = 'asc' | 'desc';
