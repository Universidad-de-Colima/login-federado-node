export interface RouterError {
  message: string;
  statusText?: string;
  status?: number;
}

export type ActivityMode = 'admin' | 'read' | 'create' | 'public' | 'only' | 'public-compact' | 'student' | 'coordinator' | 'director' | 'overview' | 'responsible' | 'promotor' | 'p-difusion' | 'difusion';

export type ActivityAction = 'review' | 'inscriptions' | 'sessions' | 'edit' | 'delete' | 'enroll' | 'attendances' | 'unroll' | 'evidences' | 'periods' | 'view' | 'reports' | 'publish' | 'unpublish' | 'pays' | 'plan_intervencion';

export type ActivityVariant = 'compact' | 'detailed' | 'row';