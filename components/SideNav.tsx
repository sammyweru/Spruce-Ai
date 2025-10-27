
import React from 'react';
import AppModeToggle from './AppModeToggle';
import { HomeIcon, SwatchIcon, BookmarkIcon, FolderIcon, BookOpenIcon, CommunityIcon, SpruceIcon, UserIcon, ArrowRightOnRectangleIcon, ChevronDoubleLeftIcon } from './icons';

type View = 'dashboard' | 'designer' | 'projects' | 'project_hub' | 'logbook' | 'showroom' | 'designs';
type AppMode = 'personal' | 'pro';

const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { view: 'designer', label: 'AI Designer', icon: SwatchIcon },
    { view: 'designs', label: 'My Designs', icon: BookmarkIcon },
    { view: 'projects', label: 'Projects', icon: FolderIcon },
    { view: 'logbook', label: 'Logbook', icon: BookOpenIcon },
    { view: 'showroom', label: 'Community', icon: CommunityIcon },
];

interface NavButtonProps {
    view: View;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon: Icon, isActive, onClick, isCollapsed }) => (
    <button
        onClick={onClick}
        title={isCollapsed ? label : undefined}
        className={`flex items-center w-full py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            isCollapsed ? 'justify-center px-2' : 'px-4'
        } ${
            isActive 
            ? 'bg-teal-500/10 text-teal-700' 
            : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
        }`}
    >
        <Icon className={`w-5 h-5 transition-all ${!isCollapsed ? 'mr-3' : 'mr-0'}`} />
        {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
);

interface SideNavProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    appMode: AppMode;
    setAppMode: (mode: AppMode) => void;
    onShowProfile: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ currentView, setCurrentView, appMode, setAppMode, onShowProfile, isCollapsed, onToggleCollapse }) => {
    return (
        <aside className={`transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {isCollapsed ? (
                 <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200">
                    <button onClick={onToggleCollapse} title="Expand Menu" className="p-2 rounded-lg hover:bg-slate-100">
                        <SpruceIcon className="w-8 h-8 text-teal-600" />
                    </button>
                </div>
            ) : (
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200">
                    <a onClick={() => setCurrentView('dashboard')} href="#" className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                        <SpruceIcon className="w-8 h-8 text-teal-600" />
                        <span>Spruce</span>
                    </a>
                    <button onClick={onToggleCollapse} title="Collapse Menu" className="p-2 rounded-full hover:bg-slate-100">
                        <ChevronDoubleLeftIcon className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            )}
            
            <nav className="flex-1 p-4 space-y-2">
                {appMode === 'personal' ? (
                    navItems.map(item => (
                        <NavButton
                            key={item.view}
                            view={item.view as View}
                            label={item.label}
                            icon={item.icon}
                            isActive={currentView === item.view}
                            onClick={() => setCurrentView(item.view as View)}
                            isCollapsed={isCollapsed}
                        />
                    ))
                ) : (
                    <>
                        <NavButton
                            view={'dashboard'}
                            label="Pro Dashboard"
                            icon={HomeIcon}
                            isActive={true}
                            onClick={() => {}}
                            isCollapsed={isCollapsed}
                        />
                    </>
                )}
            </nav>

             <div className="p-4 border-t border-slate-200 space-y-4">
                {!isCollapsed && <AppModeToggle selectedMode={appMode} onModeChange={setAppMode} />}
                <div className={`flex items-center rounded-lg ${isCollapsed ? 'justify-center' : 'justify-between p-2 bg-slate-100'}`}>
                    <div className="flex items-center gap-2">
                         <button onClick={onShowProfile} title={isCollapsed ? "View Profile" : undefined}>
                            <UserIcon className="w-8 h-8 p-1.5 bg-slate-200 text-slate-600 rounded-full" />
                         </button>
                        {!isCollapsed && (
                            <div>
                                <p className="text-sm font-bold text-slate-800">Jane Doe</p>
                                <button onClick={onShowProfile} className="text-xs text-slate-500 hover:underline">View Profile</button>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full" title="Log Out">
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default SideNav;
