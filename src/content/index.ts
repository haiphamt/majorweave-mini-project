import type { ContentPack } from '../domain/contracts';
import { backendPack } from './paths/backend';
import { frontendPack } from './paths/frontend';
import { fullstackPack } from './paths/fullstack';
import { uxPack } from './paths/ux';
import { mobilePack } from './paths/mobile';
import { gamePack } from './paths/game';

// Content drafts are registered for integration, not promoted to reviewed/ready.
export const contentPacks: readonly ContentPack[] = [backendPack, frontendPack, fullstackPack, uxPack, mobilePack, gamePack];
