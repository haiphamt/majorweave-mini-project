import { createRoadmapStore } from './roadmap-store';
import { validateWorkspace, validateBackupFile } from '../domain/validate';
import { exportBackup } from './backup';

export async function readGuestBackup() {
  const result = await createRoadmapStore({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, validate: validateWorkspace }).loadWorkspace();
  if (!result.ok) return result;
  return exportBackup(result.value, { exportedAt: new Date().toISOString(), unsaved: false }, { workspace: validateWorkspace, backup: validateBackupFile });
}
