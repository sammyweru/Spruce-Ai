
import React, { useState } from 'react';
import { ImageFile } from '../types';
import ImageUploader from './ImageUploader';
import { generateVirtualStaging } from '../services/geminiService';
import { PlusCircleIcon, SparklesIcon } from './icons';
import { DESIGN_STYLES } from '../constants';

interface ProToolkitViewProps {
    onImageStaged: (image: ImageFile) => void;
}

const ProToolkitView: React.FC<ProToolkitViewProps> = ({ onImageStaged }) => {
    const [emptyRoomImage, setEmptyRoomImage] = useState<ImageFile | null>(null);
    const [stagedImage, setStagedImage] = useState<ImageFile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(DESIGN_STYLES[0]);
    const [error, setError] = useState<string | null>(null);

    const handleStageImage = async () => {
        if (!emptyRoomImage) return;
        setIsLoading(true);
        setError(null);
        setStagedImage(null);
        try {
            const result = await generateVirtualStaging(emptyRoomImage, selectedStyle);
            setStagedImage(result);
            onImageStaged(result);
        } catch (e) {
            console.error("Failed to stage image:", e);
            setError("Sorry, the virtual staging failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fade-in-up">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Pro Toolkit: AI Virtual Staging</h2>
                <p className="mt-1 text-md text-slate-500">Upload a photo of an empty room to instantly furnish it for your listing.</p>
            </header>

            <div className="max-w-4xl mx-auto space-y-6">
                {!emptyRoomImage ? (
                     <ImageUploader onImageUpload={setEmptyRoomImage} disabled={isLoading}>
                        <div className="w-full aspect-video bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                           <PlusCircleIcon className="w-12 h-12" />
                           <p className="mt-2 font-semibold">Click or drag to upload empty room photo</p>
                        </div>
                    </ImageUploader>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Original Empty Room</h3>
                            <img src={`data:${emptyRoomImage.mimeType};base64,${emptyRoomImage.base64}`} alt="Empty Room" className="rounded-lg shadow-md" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">AI-Staged Result</h3>
                            <div className="w-full aspect-video bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                                {isLoading ? (
                                    <div className="text-center text-slate-500">
                                        <SparklesIcon className="w-10 h-10 mx-auto animate-pulse" />
                                        <p className="mt-2">Staging in progress...</p>
                                    </div>
                                ) : stagedImage ? (
                                    <img src={`data:${stagedImage.mimeType};base64,${stagedImage.base64}`} alt="Staged Room" className="rounded-lg shadow-md" />
                                ) : (
                                    <p className="text-slate-400">Your staged image will appear here.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="text-center text-red-600">{error}</p>}

                {emptyRoomImage && (
                    <div className="p-4 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col md:flex-row items-center justify-center gap-4">
                        <div>
                            <label htmlFor="style-select" className="text-sm font-medium text-slate-700">Select a design style:</label>
                            <select 
                                id="style-select"
                                value={selectedStyle}
                                onChange={e => setSelectedStyle(e.target.value)}
                                className="mt-1 block w-full md:w-auto pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            >
                                {DESIGN_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleStageImage}
                            disabled={isLoading}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-500 transition-colors disabled:bg-slate-400"
                        >
                            <SparklesIcon className="w-6 h-6" />
                            <span>{isLoading ? 'Staging...' : `Stage with ${selectedStyle} Style`}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProToolkitView;
