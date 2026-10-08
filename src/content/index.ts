import type { ContentPack } from '../domain/contracts';
import { backendPack } from './paths/backend';
import { mobilePack } from './paths/mobile';
import { gamePack } from './paths/game';

// Content drafts are registered for integration, not promoted to reviewed/ready.
export const contentPacks: readonly ContentPack[] = [backendPack, mobilePack, gamePack];
