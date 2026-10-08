import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { contentPacks } from '../content';
import { createRoadmapStore } from '../persistence/roadmap-store';
import { createWorkspaceController } from './workspace-controller';
import type { WorkspaceController, WorkspaceOptions } from './workspace-api';

const WorkspaceContext = createContext<WorkspaceController | null>(null);

function browserOptions(): WorkspaceOptions {
  return {
    packs: contentPacks,
    persistence: createRoadmapStore({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    now: () => new Date().toISOString(),
    today: () => {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    nextId: () => crypto.randomUUID(),
  };
}

/** One v2 controller per application. Legacy provider remains during migration. */
export function WorkspaceProvider({ children, options }: { children: ReactNode; options?: WorkspaceOptions }) {
  const [controller] = useState(() => createWorkspaceController(options ?? browserOptions()));
  useEffect(() => { void controller.initialize(); }, [controller]);
  return <WorkspaceContext.Provider value={controller}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const controller = useContext(WorkspaceContext);
  if (!controller) throw new Error('useWorkspace must be inside WorkspaceProvider');
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const activePlan = state.workspace?.plans.find(plan => plan.id === state.workspace?.activePlanId) ?? null;
  return { ...state, activePlan, actions: controller };
}
