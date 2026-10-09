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
  { id: 'ise', name: 'Khoa Khoa học & Kỹ thuật Thông tin' },
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
  { id: 'it', departmentId: 'ise', name: 'Công nghệ Thông tin' },
  { id: 'data', departmentId: 'ise', name: 'Khoa học Dữ liệu' },
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

// Transitional presentation metadata is reused while the v1 plan/profile remain available.
// v2 owns the approved 18-path membership and relations; consumers import this catalog.
import { paths as legacyPaths, majorProfiles } from '../catalog';
import type { LearningPath } from '../catalog';
export { majorProfiles };
export const faculties = DEPARTMENTS.map(d => ({ ...d, name: d.name.replace(/^Khoa /, ''), majors: getMajorsByDepartment(d.id) }));
const near: Record<string, string[]> = {
  software: ['backend','frontend','fullstack','mobile','game','qa','devops'],
  multimedia: ['ux','analyst'],
  cs: ['backend','frontend','fullstack','mobile','game','scientist','engineer','ml','mlops','ai-engineer'],
  ai: ['ml','scientist','mlops','ai-engineer'],
  is: ['business-analyst','analyst','bi','engineer','backend','fullstack','qa'],
  ecommerce: ['business-analyst','analyst','bi'],
  it: ['backend','frontend','fullstack','mobile','qa','devops','analyst','bi','engineer','network','business-analyst'],
  data: ['analyst','bi','scientist','engineer','ml','mlops'],
  networks: ['network','devops','security'], security: ['security','network'], computer: ['network'], chip: [],
};
const extending: Record<string, string[]> = {
  software: ['business-analyst','ai-engineer','analyst','engineer','ml','mlops','network','security','ux'],
  multimedia: ['frontend','game','mobile','bi','scientist','ml','ai-engineer'],
  cs: ['qa','devops','analyst','bi','network','security','business-analyst'],
  ai: ['backend','fullstack','game','devops','analyst','engineer'],
  is: ['frontend','mobile','devops','scientist','ml','ai-engineer','security','ux'],
  ecommerce: ['backend','frontend','fullstack','mobile','qa','engineer','scientist','ux','ai-engineer'],
  it: ['game','scientist','ml','mlops','ai-engineer','security','ux'],
  data: ['backend','fullstack','devops','ai-engineer','business-analyst'],
  networks: ['backend','engineer','mlops','ai-engineer'], security: ['devops','backend','qa','ai-engineer'],
  computer: ['backend','mobile','game','devops','security','ml','mlops','ai-engineer'],
  chip: ['network','backend','mobile','game','devops','security','ml','mlops','ai-engineer'],
};
const additions: LearningPath[] = [
  { id:'ai-engineer',name:'AI Engineer',category:'AI',icon:'brain',summary:'Xây ứng dụng AI, đánh giá kết quả và tích hợp mô hình vào sản phẩm.',tags:['LLM','RAG','Evaluation'],majors:[],relatedMajors:[],foundations:'Python, API, dữ liệu, đánh giá ứng dụng, bảo mật và vận hành.',sample:false,roadmaps:[{label:'AI Engineer',url:'https://roadmap.sh/ai-engineer'}] },
  { id:'business-analyst',name:'Business Analyst',category:'BUSINESS',icon:'business',summary:'Khảo sát nhu cầu, phân tích quy trình và quản lý yêu cầu của tổ chức.',tags:['Requirements','Process','Stakeholders'],majors:[],relatedMajors:[],foundations:'Khảo sát, mô hình hóa quy trình, user story, ưu tiên và xác nhận yêu cầu.',sample:false,roadmaps:[{label:'IIBA — Business Analysis',url:'https://www.iiba.org/business-analysis-blogs/what-is-business-analysis/'}] },
];
export const paths: LearningPath[] = CAREER_PATHS.map(p => {
  const presentation = [...legacyPaths,...additions].find(item => item.id === p.id)!;
  return { ...presentation, majors: MAJORS.filter(m => near[m.id].includes(p.id)).map(m => m.id), relatedMajors: MAJORS.filter(m => extending[m.id].includes(p.id)).map(m => m.id) };
});
export const catalogScopeNote = 'Danh mục được phân công gồm 18 hướng. Business Analyst dùng nguồn nghề nghiệp IIBA; các mối liên hệ ngành–hướng là gợi ý biên soạn của nhóm.';
export const majorCoverageNotes: Record<string,string> = { computer:'KTMT / Thiết kế Vi mạch cùng nhóm khám phá phần mềm và hạ tầng; đây không phải lộ trình đào tạo vi mạch.', chip:'Giữ ngành Thiết kế Vi mạch trong hồ sơ. Các hướng này là phần mềm/hạ tầng mở rộng, không thay thế chương trình VLSI/FPGA/Embedded.' };
export const catalogCheckedAt = '04/10/2026 (baseline phạm vi nhóm)';
export const relationRank = (p: LearningPath, major: string) => p.majors.includes(major) ? 2 : p.relatedMajors.includes(major) ? 1 : 0;
export const majorPaths = (id: string) => ({ primary: paths.filter(p => p.majors.includes(id)), related: paths.filter(p => p.relatedMajors.includes(id)) });