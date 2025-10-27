import React, { useState } from 'react';
import { Project, MoodBoardCollection, ProjectMessage, ChatMessage } from '../types';
import { ArrowLeftIcon } from './icons';
import MoodBoard from './MoodBoard';
import BudgetTracker from './BudgetTracker';
import ChatInterface from './ChatInterface';

interface ProjectHubProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updatedProject: Project) => void;
}

type HubTab = 'chat' | 'budget' | 'moodboard';

const ProjectHub: React.FC<ProjectHubProps> = ({ project, onBack, onUpdateProject }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('chat');
  
  const mappedMessages: ChatMessage[] = project.messages.map(m => ({
      sender: m.sender === 'user' ? 'user' : 'ai', // Adapt to ChatMessage type
      text: m.text,
      image: m.image,
      actions: m.isApproval ? ['approve'] as const : undefined,
      isApproved: m.isApproved
  }));

  const handleSendMessage = (text: string) => {
    const newMessage: ProjectMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date().toISOString(),
    };
    const updatedProject = { ...project, messages: [...project.messages, newMessage] };
    onUpdateProject(updatedProject);
  }
  
  const handleApprove = (message: ChatMessage, index: number) => {
    const updatedMessages = project.messages.map((m, i) => {
        if (i === index) {
            return { ...m, isApproved: true };
        }
        return m;
    });
    const updatedProject = { ...project, messages: updatedMessages };
    onUpdateProject(updatedProject);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface 
                    messages={mappedMessages} 
                    onSendMessage={handleSendMessage} 
                    disabled={false} 
                    isBotResponding={false}
                    onApprove={handleApprove}
                    placeholder={`Chat with ${project.proName}...`}
                />;
      case 'budget':
        return <BudgetTracker items={project.budgetItems} total={project.budgetTotal} />;
      case 'moodboard':
        return <MoodBoard collections={project.moodboard} onClear={() => {}} />;
      default:
        return null;
    }
  };
  
  const TabButton = ({ tab, label }: { tab: HubTab, label: string }) => (
    <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
        {label}
    </button>
  );

  return (
    <div className="animate-fade-in-up">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full bg-white hover:bg-slate-100 transition-colors">
                <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
                <p className="text-md text-slate-500">Project with {project.proName}</p>
            </div>
        </div>
      </header>
      
      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center gap-2 mb-6">
        <TabButton tab="chat" label="Chat & Approvals" />
        <TabButton tab="budget" label="Budget Tracker" />
        <TabButton tab="moodboard" label="Mood Board" />
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectHub;