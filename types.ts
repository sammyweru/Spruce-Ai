
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
  sources?: GroundingChunk[];
  image?: ImageFile;
  actions?: 'approve'[];
  isApproved?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface ImageRef {
  id: string;
  mimeType: string;
  name: string;
}

export interface MoodBoardCollection {
  id: string;
  image: ImageFile;
  style: string;
  palette: string[];
}

export interface SavedDesign {
  id: string;
  originalImage: ImageRef;
  generatedImage: ImageRef;
  style: string;
  timestamp: string;
}

export interface ShowroomItem {
  id: string;
  originalImage: ImageFile;
  generatedImage: ImageFile;
  style: string;
  author: string;
  likes: number;
  palette: string[];
}

export interface StyleProfile {
  [style: string]: number;
}

// New types for all the added features

export interface HomeProfile {
  houseType: string;
  projectGoal: 'interior' | 'exterior' | 'doctor' | 'upcycle';
  budget: number;
  painPoints: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  cost: number;
}

export interface ProjectMessage {
  id: string;
  sender: 'user' | 'pro';
  text: string;
  timestamp: string;
  image?: ImageFile;
  isApproval?: boolean;
  isApproved?: boolean;
}

export interface Project {
  id: string;
  name: string;
  proName: string;
  budgetTotal: number;
  moodboard: MoodBoardCollection[];
  budgetItems: BudgetItem[];
  messages: ProjectMessage[];
}

export interface LogEntry {
  id: string;
  date: string;
  category: 'Paint' | 'Appliance' | 'Repair' | 'Installation' | 'Other';
  description: string;
  details: string;
  cost?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  image: ImageFile;
}

export interface ChallengeSubmission {
  id: string;
  author: string;
  generatedImage: ImageFile;
  votes: number;
}

export interface DesignChallenge {
  id: string;
  title: string;
  description: string;
  promptImage: ImageFile;
  submissions: ChallengeSubmission[];
}