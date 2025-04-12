export interface User {
  id: string;
  name: string;
  institution: string;
  email: string;
  password: string;
  createdAt: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  isBeginner: boolean;
  isPreparingExam: boolean;
  expectedDate: string;
  createdAt: string;
  resources: {
    youtubeLinks: string[];
    blogLinks: string[];
    keyPoints: string[];
  };
  progress: {
    completedResources: string[];
    notes: string[];
    lastAccessed: string;
  };
} 