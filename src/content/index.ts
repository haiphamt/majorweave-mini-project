import type { ContentPack } from '../domain/contracts';
import { backendPack } from './paths/backend';
import { frontendPack } from './paths/frontend';
import { fullstackPack } from './paths/fullstack';
import { uxPack } from './paths/ux';
import { mobilePack } from './paths/mobile';
import { gamePack } from './paths/game';
import { scientistPack } from './paths/scientist';
import { mlPack } from './paths/ml';
import { mlopsPack } from './paths/mlops';
import { aiEngineerPack } from './paths/ai-engineer';
import { analystPack } from './paths/analyst';
import { biPack } from './paths/bi';
import { engineerPack } from './paths/engineer';
import { businessAnalystPack } from './paths/business-analyst';
import { devopsPack } from './paths/devops';
import { networkPack } from './paths/network';
import { securityPack } from './paths/security';
import { qaPack } from './paths/qa';

// Content drafts are registered for integration, not promoted to reviewed/ready.
export const contentPacks: readonly ContentPack[] = [backendPack, frontendPack, fullstackPack, uxPack, mobilePack, gamePack,
  scientistPack, mlPack, mlopsPack, aiEngineerPack, analystPack, biPack, engineerPack, businessAnalystPack,
  devopsPack, networkPack, securityPack, qaPack];
