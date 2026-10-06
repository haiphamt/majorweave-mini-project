import { createContext, useContext } from 'react';
import type { State } from '../state';

// Giai đoạn chuyển cấu trúc: UI vẫn dùng State v1; Workspace v2 chưa được nối vào.
export type LegacyAppContext = { state: State; update: (patch: Partial<State>) => void; toast: (message: string) => void; openModule: (id: string) => void };
export const Context = createContext<LegacyAppContext>(null!);
export const useApp = () => useContext(Context);

