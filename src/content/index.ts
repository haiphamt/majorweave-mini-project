import type { ContentPack } from '../domain/contracts';
import { backendPack } from './paths/backend';

// Registry v2: hiện có Backend đang review; chưa nối vào UI và chưa đủ các hướng.
export const contentPacks: readonly ContentPack[] = [backendPack];
