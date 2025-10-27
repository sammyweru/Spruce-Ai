export const storage = {
    get: <T,>(key: string, fallback: T): T => {
      if (typeof window === 'undefined') {
        return fallback;
      }
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
      } catch (e) {
        console.error(`Failed to load ${key} from localStorage`, e);
        return fallback;
      }
    },
    set: <T,>(key: string, value: T) => {
      if (typeof window === 'undefined') {
        return;
      }
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Failed to save ${key} to localStorage`, e);
        throw e;
      }
    },
  };
  
  export const STORAGE_KEYS = {
    HOME_PROFILE: 'spruceHomeProfile',
    PROJECTS: 'spruceProjects',
    LOGBOOK: 'spruceLogbook',
    INVENTORY: 'spruceInventory',
    MOODBOARD: 'spruceMoodboard',
    SAVED_DESIGNS: 'spruceSavedDesigns',
  };
  