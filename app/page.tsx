'use client';
import React, { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImageComparator from '../components/ImageComparator';
import ChatInterface from '../components/ChatInterface';
import { conversationaLDesign, extractColorPalette, findShoppableItems, generateDIYGuide, generateVirtualStaging, generateSeasonalLandscape } from '../services/geminiService';
import * as styleProfileService from '../services/styleProfileService';
import * as dbService from '../services/dbService';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { ChatMessage, ImageFile, MoodBoardCollection, ShowroomItem, StyleProfile, HomeProfile, Project, LogEntry, InventoryItem, DesignChallenge, SavedDesign } from '../types';
import { SwatchIcon, PinIcon, PlusCircleIcon, FolderIcon, ArrowLeftIcon, ClipboardCheckIcon, BookmarkIcon, RectangleGroupIcon, SpruceIcon } from '../components/icons';
import MoodBoard from '../components/MoodBoard';
import ImageFilterControls from '../components/ImageFilterControls';
import Modal from '../components/Modal';
import CommunityShowroom from '../components/CommunityShowroom';
import { showroomData, challengesData } from '../data/showroomData';
import StyleProfileModal from '../components/StyleProfileModal';
import DesignModeToggle from '../components/DesignModeToggle';
import FindProModal from '../components/FindProModal';
import ProToolkitView from '../components/ProToolkitView';
import OnboardingModal from '../components/OnboardingModal';
import ConciergeInbox from '../components/ConciergeInbox';
import ProjectsView from '../components/ProjectsView';
import ProjectHub from '../components/ProjectHub';
import HomeLogbookView from '../components/HomeLogbookView';
import BudgetSelector from '../components/BudgetSelector';
import InventoryManager from '../components/InventoryManager';
import DIYGuideModal from '../components/DIYGuideModal';
import SeasonalVisualizer from '../components/SeasonalVisualizer';
import MyDesignsView from '../components/MyDesignsView';
import SideNav from '../components/SideNav';

type AppMode = 'personal' | 'pro';
type View = 'dashboard' | 'designer' | 'projects' | 'project_hub' | 'logbook' | 'showroom' | 'designs';
type DesignMode = 'interior' | 'exterior' | 'doctor' | 'upcycle';
type Budget = 'low' | 'mid' | 'high';
type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';
interface SeasonalDesigns {
    Spring?: ImageFile | 'loading';
    Summer?: ImageFile | 'loading';
    Fall?: ImageFile | 'loading';
    Winter?: ImageFile | 'loading';
}

const App: React.FC = () => {
  // Core App State
  const [appMode, setAppMode] = useState<AppMode>('personal');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);

  // Designer State
  const [designMode, setDesignMode] = useState<DesignMode>('interior');
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  const [budget, setBudget] = useState<Budget>('mid');
  const [activeInventoryItems, setActiveInventoryItems] = useState<InventoryItem[]>([]);
  
  // UI State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [isFindingItems, setIsFindingItems] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingSeason, setIsGeneratingSeason] = useState(false);
  
  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFindProModal, setShowFindProModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showDIYGuideModal, setShowDIYGuideModal] = useState(false);
  const [diyGuideContent, setDiyGuideContent] = useState('');

  // User Data (with localStorage persistence)
  const [homeProfile, setHomeProfile] = useState<HomeProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logbookEntries, setLogbookEntries] = useState<LogEntry[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [moodBoard, setMoodBoard] = useState<MoodBoardCollection[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [showroomItems, setShowroomItems] = useState<ShowroomItem[]>(showroomData);
  const [challenges, setChallenges] = useState<DesignChallenge[]>(challengesData);
  const [styleProfile, setStyleProfile] = useState<StyleProfile>({});
  
  const [lastUsedStyle, setLastUsedStyle] = useState<string>('Custom');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [seasonalDesigns, setSeasonalDesigns] = useState<SeasonalDesigns>({});
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    dbService.initDB();
    const loadedProfile = storage.get<HomeProfile | null>(STORAGE_KEYS.HOME_PROFILE, null);
    if (loadedProfile) {
      setHomeProfile(loadedProfile);
    } else {
      setShowOnboardingModal(true);
    }
    setProjects(storage.get<Project[]>(STORAGE_KEYS.PROJECTS, []));
    setLogbookEntries(storage.get<LogEntry[]>(STORAGE_KEYS.LOGBOOK, []));
    setInventory(storage.get<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []));
    setMoodBoard(storage.get<MoodBoardCollection[]>(STORAGE_KEYS.MOODBOARD, []));
    setSavedDesigns(storage.get<SavedDesign[]>(STORAGE_KEYS.SAVED_DESIGNS, []));

    setStyleProfile(styleProfileService.getProfile());
  }, []);
  
  
  const handleSaveHomeProfile = (profile: HomeProfile) => {
    setHomeProfile(profile);
    storage.set(STORAGE_KEYS.HOME_PROFILE, profile);
    setShowOnboardingModal(false);
  }

  const resetDesignerForNewImage = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setChatHistory([]);
    setError(null);
    setActiveFilter('none');
    setSeasonalDesigns({});
    setActiveSeason(null);
  }

  const handleImageUpload = (file: ImageFile) => {
    setOriginalImage(file);
    setGeneratedImage(null);
    setSeasonalDesigns({});
    setActiveSeason(null);
    let welcomeMessage = "Hello! I'm Spruce, your AI design assistant for your home in Kenya. How can I help you today?";
    switch(designMode) {
        case 'interior': welcomeMessage = "Let's redesign this room! What's your vision? You can ask for a style like 'Afro-Modern' or a specific change like 'add more natural light'."; break;
        case 'exterior': welcomeMessage = "Ready to boost your curb appeal? I can help with new paint, landscaping ideas, or even adding a new patio."; break;
        case 'doctor': welcomeMessage = "I'm the Home Doctor. I'll do my best to diagnose the issue in your photo and suggest a solution."; break;
        case 'upcycle': welcomeMessage = "Great find! What kind of new life do you want to give this piece? Tell me if you want it to look 'modern', 'rustic', 'colorful', etc."; break;
    }
    setChatHistory([{ sender: 'ai', text: welcomeMessage, timestamp: new Date().toISOString() }]);
    setError(null);
    setActiveFilter('none');
  };

  const handleSendMessage = async (message: string) => {
    if (isBotResponding || !originalImage) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: message, timestamp: new Date().toISOString() }]);
    setIsBotResponding(true);
    setError(null);
    
    try {
        const imageToProcess = generatedImage || originalImage;
        const response = await conversationaLDesign(imageToProcess, message, styleProfile, designMode, homeProfile, budget, activeInventoryItems);
        
        const aiResponse: ChatMessage = { 
            sender: 'ai', 
            text: response.text ?? "Sorry, I couldn't generate a text response for that.", 
            timestamp: new Date().toISOString() 
        };
        if (response.image) {
            setGeneratedImage(response.image);
            setLastUsedStyle(response.style || 'Custom');
        }
        setChatHistory(prev => [...prev, aiResponse]);

    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred. Please try again.";
        setError(errorMessage);
        setChatHistory(prev => [...prev, { sender: 'ai', text: errorMessage, timestamp: new Date().toISOString() }]);
    } finally {
        setIsBotResponding(false);
    }
  };

  const handleSelectSeason = async (season: Season) => {
    if (isGeneratingSeason || !originalImage) return;

    if (activeSeason === season) return;
    
    setActiveSeason(season);

    const existingDesign = seasonalDesigns[season];
    if (existingDesign && existingDesign !== 'loading') {
        setGeneratedImage(existingDesign as ImageFile);
        return;
    }

    setIsGeneratingSeason(true);
    setError(null);
    setSeasonalDesigns(prev => ({ ...prev, [season]: 'loading' }));

    try {
        const result = await generateSeasonalLandscape(originalImage, season);
        setSeasonalDesigns(prev => ({ ...prev, [season]: result }));
        setGeneratedImage(result);
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : `I had trouble generating the ${season} view. Please try again.`;
        setError(errorMessage);
        setSeasonalDesigns(prev => ({ ...prev, [season]: undefined }));
        setActiveSeason(null);
        setGeneratedImage(null);
    } finally {
        setIsGeneratingSeason(false);
    }
  };
  
  const handleItemSelect = async (x: number, y: number, displayWidth: number, displayHeight: number) => {
    if (!generatedImage || isFindingItems || isBotResponding) return;

    setIsFindingItems(true);
    // Add a user-like message to the chat history to represent the click action.
    setChatHistory(prev => [...prev, { sender: 'user', text: "What's this item and where can I buy it?", timestamp: new Date().toISOString() }]);
    setError(null);

    try {
        // Normalize coordinates to be between 0 and 1.
        const clickPosition = {
            x: x / displayWidth,
            y: y / displayHeight
        };
        
        const response = await findShoppableItems(generatedImage, budget, clickPosition);
        
        const aiResponse: ChatMessage = { 
            sender: 'ai', 
            text: response.text ?? "I found some items, please see the links below.",
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
            timestamp: new Date().toISOString()
        };
        
        setChatHistory(prev => [...prev, aiResponse]);
    } catch(e) {
        console.error("Failed to find shoppable items:", e);
        const errorMessage = e instanceof Error ? e.message : "Sorry, I couldn't find any products for that item. Please try again.";
        setError(errorMessage);
        setChatHistory(prev => [...prev, { sender: 'ai', text: errorMessage, timestamp: new Date().toISOString() }]);
    } finally {
        setIsFindingItems(false);
    }
  };

  const handlePinToBoard = async () => {
    if (!generatedImage || isPinning) return;
    
    setIsPinning(true);
    try {
      const palette = await extractColorPalette(generatedImage);
      const newCollection: MoodBoardCollection = { id: Date.now().toString(), image: generatedImage, style: lastUsedStyle, palette };
      const newMoodBoard = [newCollection, ...moodBoard];
      setMoodBoard(newMoodBoard);
      storage.set(STORAGE_KEYS.MOODBOARD, newMoodBoard);
      const newProfile = styleProfileService.recordPreference(lastUsedStyle);
      setStyleProfile(newProfile);
    } catch (e) {
      console.error("Failed to pin:", e);
      const errorMessage = e instanceof Error ? e.message : "Could not add to mood board.";
      setError(errorMessage);
    } finally {
      setIsPinning(false);
    }
  };

  const handleSaveDesign = async () => {
    if (!originalImage || !generatedImage || isSavingDesign) return;
    
    setIsSavingDesign(true);
    try {
        const originalImageId = `img-${Date.now()}-orig`;
        const generatedImageId = `img-${Date.now()}-gen`;

        // Save full base64 images to IndexedDB
        await dbService.saveImage(originalImageId, originalImage.base64);
        await dbService.saveImage(generatedImageId, generatedImage.base64);
        
        const newDesign: SavedDesign = {
            id: `design-${Date.now()}`,
            originalImage: {
                id: originalImageId,
                mimeType: originalImage.mimeType,
                name: originalImage.name,
            },
            generatedImage: {
                id: generatedImageId,
                mimeType: generatedImage.mimeType,
                name: generatedImage.name,
            },
            style: lastUsedStyle,
            timestamp: new Date().toISOString(),
        };
        const newSavedDesigns = [newDesign, ...savedDesigns];
        setSavedDesigns(newSavedDesigns);
        storage.set(STORAGE_KEYS.SAVED_DESIGNS, newSavedDesigns);
    } catch (e) {
        console.error("Failed to save design:", e);
        setError("Could not save the design. Your browser's storage might be full.");
    } finally {
        setIsSavingDesign(false);
    }
  };

  const handleGenerateDIYGuide = async () => {
    if (!generatedImage) return;
    setIsBotResponding(true);
    try {
        const guide = await generateDIYGuide(generatedImage);
        setDiyGuideContent(guide);
        setShowDIYGuideModal(true);
    } catch (e) {
        console.error("Failed to generate DIY guide", e);
        const errorMessage = e instanceof Error ? e.message : "Sorry, I couldn't generate the guide for this design.";
        setError(errorMessage);
    } finally {
        setIsBotResponding(false);
    }
  };

  const handleStartProject = (proName: string) => {
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: `Renovation with ${proName}`,
        proName,
        budgetTotal: 250000,
        moodboard: [],
        budgetItems: [],
        messages: [{
            id: `msg-${Date.now()}`,
            sender: 'pro',
            text: `Hi! I'm ${proName}. Looking forward to working on your project. I've set up this hub for us to collaborate.`,
            timestamp: new Date().toISOString()
        }]
    };
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    storage.set(STORAGE_KEYS.PROJECTS, updatedProjects);
    setActiveProject(newProject);
    setCurrentView('project_hub');
    setShowFindProModal(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    storage.set(STORAGE_KEYS.PROJECTS, updatedProjects);
    if (activeProject?.id === updatedProject.id) {
      setActiveProject(updatedProject);
    }
  };
  
  const handleUpdateLogbookEntries = (newEntries: LogEntry[]) => {
    setLogbookEntries(newEntries);
    storage.set(STORAGE_KEYS.LOGBOOK, newEntries);
  }

  const handleUpdateInventory = (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    storage.set(STORAGE_KEYS.INVENTORY, newInventory);
  }

  const getUploaderDescription = () => {
    switch (designMode) {
        case 'interior': return "Upload a photo of your room to get started. Let's create your dream space!";
        case 'exterior': return "Upload a photo of your home's exterior to improve its curb appeal.";
        case 'doctor': return "Upload a photo of the problem area (like a crack, leak, or sick plant) for a diagnosis.";
        case 'upcycle': return "Ready to give old furniture new life? Upload a photo of your item to begin.";
        default: return "Upload a photo to get started. Choose a mode to tell the AI what you need help with.";
    }
  }
  
  const renderDashboard = () => (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
        {homeProfile && <ConciergeInbox profile={homeProfile} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                    <button
                        onClick={() => setCurrentView('designer')}
                        className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-teal-50 rounded-lg transition-colors text-left"
                    >
                        <SwatchIcon className="w-8 h-8 text-teal-600" />
                        <div>
                            <p className="font-semibold text-slate-800">Start New Design</p>
                            <p className="text-sm text-slate-500">Create a new look with the AI Designer</p>
                        </div>
                    </button>
                    <button
                        onClick={() => setCurrentView('projects')}
                        className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-teal-50 rounded-lg transition-colors text-left"
                    >
                        <FolderIcon className="w-8 h-8 text-teal-600" />
                        <div>
                            <p className="font-semibold text-slate-800">View My Projects</p>
                            <p className="text-sm text-slate-500">Manage ongoing work with professionals</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Designs</h2>
                {savedDesigns.length > 0 ? (
                    <div className="space-y-3">
                        {savedDesigns.slice(0, 2).map(design => (
                            <button key={design.id} onClick={() => setCurrentView('designs')} className="w-full p-2 bg-slate-50 hover:bg-teal-50 rounded-lg transition-colors text-left flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-200 rounded-md flex-shrink-0">
                                    {/* In a real app with thumbnails, you'd load the image here */}
                                    <RectangleGroupIcon className="w-full h-full text-slate-400 p-2" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{design.style}</p>
                                    <p className="text-xs text-slate-500">Saved on {new Date(design.timestamp).toLocaleDateString()}</p>
                                </div>
                            </button>
                        ))}
                        {savedDesigns.length > 2 && (
                             <button onClick={() => setCurrentView('designs')} className="text-sm font-semibold text-teal-600 hover:underline mt-2">View all {savedDesigns.length} designs</button>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">You haven't saved any designs yet.</p>
                )}
            </div>
        </div>
    </div>
  );

  const renderDesigner = () => (
    <>
        {!originalImage ? (
          <div className="text-center min-h-[70vh] flex flex-col justify-center items-center">
              <h2 style={{ animationDelay: '0.1s', opacity: 0 }} className="text-4xl sm:text-6xl font-extrabold text-slate-800 tracking-tight animate-fade-in-up">
                  Spruce AI Designer
              </h2>
              <p style={{ animationDelay: '0.2s', opacity: 0 }} className="mt-4 max-w-xl mx-auto text-lg text-slate-500 animate-fade-in-up">
                  {getUploaderDescription()}
              </p>
              <div style={{ animationDelay: '0.3s', opacity: 0 }} className="mt-8 animate-fade-in-up">
                <ImageUploader onImageUpload={handleImageUpload} disabled={isBotResponding}>
                  <span className="inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-500 transition-all cursor-pointer">
                    <PlusCircleIcon className="w-6 h-6" />
                    <span>Upload Photo</span>
                  </span>
                </ImageUploader>
              </div>
          </div>
        ) : (
          <div className="space-y-8">
             {error && <div className="text-center text-red-700 bg-red-100 border border-red-200 p-4 rounded-lg">{error}</div>}
            
            {designMode === 'exterior' && (
                <SeasonalVisualizer 
                    designs={seasonalDesigns}
                    activeSeason={activeSeason}
                    onSelectSeason={handleSelectSeason}
                    isGenerating={isGeneratingSeason}
                />
            )}

            {generatedImage ? (
              <div className="space-y-8 animate-fade-in-up">
                <ImageComparator 
                  originalImage={`data:${originalImage.mimeType};base64,${originalImage.base64}`}
                  generatedImage={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                  activeFilter={activeFilter}
                  onItemSelect={handleItemSelect}
                  isSelectable={!isFindingItems && !isBotResponding}
                />
                <p className="text-center text-sm text-slate-500 -mt-4">✨ Click an item in the generated image to find where to buy it!</p>
                <ImageFilterControls activeFilter={activeFilter} onSelectFilter={setActiveFilter}/>
                <div className="text-center flex flex-wrap justify-center gap-4">
                      <button onClick={handleSaveDesign} disabled={isSavingDesign} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-100 transition-colors shadow-lg disabled:opacity-50">
                        <BookmarkIcon className="w-5 h-5" />
                        <span>{isSavingDesign ? 'Saving...' : 'Save Design'}</span>
                      </button>
                      <button onClick={handleGenerateDIYGuide} disabled={isBotResponding} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-100 transition-colors shadow-lg">
                          <ClipboardCheckIcon className="w-5 h-5" />
                          <span>Generate DIY Guide</span>
                      </button>
                      <button onClick={handlePinToBoard} disabled={isPinning} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-lg">
                          <PinIcon className="w-5 h-5" />
                          <span>{isPinning ? 'Pinning...' : 'Pin to Mood Board'}</span>
                      </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100/50 border border-slate-200/80 rounded-lg p-4">
                  <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Original" className="rounded-lg w-full max-w-2xl mx-auto shadow-md"/>
              </div>
            )}

            <ChatInterface 
              messages={chatHistory} 
              onSendMessage={handleSendMessage} 
              disabled={!originalImage || isGeneratingSeason}
              isBotResponding={isBotResponding}
              isFindingItems={isFindingItems}
              placeholder={
                  designMode === 'doctor' ? "Describe the problem in more detail..." :
                  designMode === 'upcycle' ? "e.g., 'Make it modern and minimalist'" :
                  "e.g., 'Make this room feel more spacious'"
              }
            />
          </div>
        )}
      </>
  );

  const renderCurrentView = () => {
    if (appMode === 'pro') {
        return <ProToolkitView onImageStaged={() => {}} />;
    }
    
    switch(currentView) {
        case 'dashboard': return renderDashboard();
        case 'designer': return renderDesigner();
        case 'designs': return <MyDesignsView designs={savedDesigns} />;
        case 'projects': return <ProjectsView projects={projects} onSelectProject={p => { setActiveProject(p); setCurrentView('project_hub'); }} onNewProject={() => setShowFindProModal(true)} />;
        case 'project_hub': return activeProject ? <ProjectHub project={activeProject} onBack={() => { setActiveProject(null); setCurrentView('projects'); }} onUpdateProject={handleUpdateProject} /> : <p>No project selected.</p>;
        case 'logbook': return <HomeLogbookView entries={logbookEntries} onUpdateEntries={handleUpdateLogbookEntries} />;
        case 'showroom': return <CommunityShowroom items={showroomItems} challenges={challenges} onLike={() => {}} />;
        default: return renderDashboard();
    }
  }
  
  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <SideNav 
        currentView={currentView}
        setCurrentView={setCurrentView}
        appMode={appMode}
        setAppMode={setAppMode}
        onShowProfile={() => setShowProfileModal(true)}
        isCollapsed={isSideNavCollapsed}
        onToggleCollapse={() => setIsSideNavCollapsed(prev => !prev)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">

            {currentView === 'designer' && appMode === 'personal' && (
                <div className="mb-8 space-y-4 max-w-4xl mx-auto">
                <DesignModeToggle selectedMode={designMode} onModeChange={setDesignMode} />
                {originalImage && designMode !== 'doctor' && designMode !== 'upcycle' && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <BudgetSelector selectedBudget={budget} onSelectBudget={setBudget} />
                        <InventoryManager 
                            inventory={inventory}
                            onUpdateInventory={handleUpdateInventory}
                            activeItems={activeInventoryItems}
                            setActiveItems={setActiveInventoryItems}
                        />
                    </div>
                )}
                </div>
            )}

            {renderCurrentView()}

            <footer className="text-center py-8 mt-16 text-slate-400 text-sm border-t border-slate-200">
                <SpruceIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>&copy; {new Date().getFullYear()} Spruce AI. All Rights Reserved.</p>
                <div className="mt-2 space-x-4">
                    <a href="#" className="hover:text-slate-600">About</a>
                    <a href="#" className="hover:text-slate-600">Contact</a>
                    <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                </div>
            </footer>
        </div>
      </main>

      {showOnboardingModal && <OnboardingModal isOpen={showOnboardingModal} onSave={handleSaveHomeProfile} onClose={() => setShowOnboardingModal(false)} />}
      {showProfileModal && <StyleProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} profile={styleProfile} />}
      {showFindProModal && <FindProModal isOpen={showFindProModal} onClose={() => setShowFindProModal(false)} onConfirm={handleStartProject} />}
      {showDIYGuideModal && <DIYGuideModal isOpen={showDIYGuideModal} onClose={() => setShowDIYGuideModal(false)} content={diyGuideContent} />}

    </div>
  );
};

export default App;
