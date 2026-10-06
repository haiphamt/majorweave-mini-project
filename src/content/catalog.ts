export type Department = {
  id: string;
  name: string;
};

export type Major = {
  id: string;
  departmentId: string;
  name: string;
  isSpecialGroup?: boolean;
};

export type CareerPath = {
  id: string;
  name: string;
  category?: 'software' | 'data' | 'infrastructure' | 'design' | 'business';
};

// 6 Khoa
export const DEPARTMENTS: Department[] = [
  { id: 'se', name: 'Khoa Công nghệ Phần mềm' },
  { id: 'cs', name: 'Khoa Khoa học Máy tính' },
  { id: 'is', name: 'Khoa Hệ thống Thông tin' },
  { id: 'it', name: 'Khoa Khoa học & Kỹ thuật Thông tin' },
  { id: 'nc', name: 'Khoa Mạng máy tính & Truyền thông' },
  { id: 'ce', name: 'Khoa Kỹ thuật Máy tính' }
];

// 12 Ngành gốc
export const MAJORS: Major[] = [
  { id: 'software', departmentId: 'se', name: 'Kỹ thuật Phần mềm' },
  { id: 'multimedia', departmentId: 'se', name: 'Truyền thông Đa phương tiện' },
  { id: 'cs', departmentId: 'cs', name: 'Khoa học Máy tính' },
  { id: 'ai', departmentId: 'cs', name: 'Trí tuệ Nhân tạo' },
  { id: 'is', departmentId: 'is', name: 'Hệ thống Thông tin' },
  { id: 'ecommerce', departmentId: 'is', name: 'Thương mại Điện tử' },
  { id: 'it', departmentId: 'it', name: 'Công nghệ Thông tin' },
  { id: 'data', departmentId: 'it', name: 'Khoa học Dữ liệu' },
  { id: 'networks', departmentId: 'nc', name: 'Mạng máy tính & Truyền thông Dữ liệu' },
  { id: 'security', departmentId: 'nc', name: 'An toàn Thông tin' },
  { id: 'computer', departmentId: 'ce', name: 'Kỹ thuật Máy tính', isSpecialGroup: true },
  { id: 'chip', departmentId: 'ce', name: 'Thiết kế Vi mạch', isSpecialGroup: true } // Khám phá chung nhóm KTMT
];

// 18 Hướng (Paths) v2
export const CAREER_PATHS: CareerPath[] = [
  { id: 'backend', name: 'Backend Developer', category: 'software' },
  { id: 'frontend', name: 'Frontend Developer', category: 'software' },
  { id: 'fullstack', name: 'Full-stack Developer', category: 'software' },
  { id: 'mobile', name: 'Mobile Developer', category: 'software' },
  { id: 'game', name: 'Game Developer', category: 'software' },
  { id: 'qa', name: 'QA / Test Automation', category: 'software' },
  
  { id: 'devops', name: 'DevOps / SRE', category: 'infrastructure' },
  { id: 'network', name: 'Network Engineer', category: 'infrastructure' },
  { id: 'security', name: 'Cyber Security', category: 'infrastructure' },
  
  { id: 'analyst', name: 'Data Analyst', category: 'data' },
  { id: 'bi', name: 'BI Analyst', category: 'data' },
  { id: 'engineer', name: 'Data Engineer', category: 'data' },
  { id: 'scientist', name: 'Data Scientist', category: 'data' },
  { id: 'ml', name: 'Machine Learning', category: 'data' },
  { id: 'mlops', name: 'MLOps Engineer', category: 'data' },
  { id: 'ai-engineer', name: 'AI Engineer', category: 'data' },
  
  { id: 'ux', name: 'UX Design', category: 'design' },
  { id: 'business-analyst', name: 'Business Analyst', category: 'business' }
];

/**
 * Lấy ra danh sách các ngành thuộc một khoa.
 */
export function getMajorsByDepartment(departmentId: string): Major[] {
  return MAJORS.filter(m => m.departmentId === departmentId);
}
