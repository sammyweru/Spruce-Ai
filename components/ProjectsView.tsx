
import React from 'react';
import { Project } from '../types';
import { FolderIcon, PlusCircleIcon } from './icons';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  // In a real app, this would trigger a flow to create a new project
  onNewProject: () => void; 
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="animate-fade-in-up">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">My Projects</h2>
        <p className="mt-1 text-md text-slate-500">Manage all your home renovation projects in one place.</p>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-lg">
            <FolderIcon className="mx-auto h-16 w-16 text-slate-400" />
            <p className="mt-4 text-xl text-slate-500">You have no active projects.</p>
            <p className="text-slate-400">Find a pro to get started and create your first Project Hub.</p>
            <button
                onClick={onNewProject}
                className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-500 transition-all cursor-pointer"
            >
                <PlusCircleIcon className="w-6 h-6" />
                <span>Find a Pro to Start a Project</span>
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <button 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="block text-left bg-white p-6 rounded-lg border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
              <p className="text-sm text-slate-500">with {project.proName}</p>
              <div className="mt-4">
                <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                    {project.messages.length} Updates
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
