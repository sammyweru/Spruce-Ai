
import React, { useState, useEffect } from 'react';
import { SavedDesign } from '../types';
import { BookmarkIcon, SparklesIcon } from './icons';
import Modal from './Modal';
import ImageComparator from './ImageComparator';
import * as dbService from '../services/dbService';

interface MyDesignsViewProps {
  designs: SavedDesign[];
}

const DesignCard: React.FC<{design: SavedDesign, onClick: () => void}> = ({ design, onClick }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        let isMounted = true;
        dbService.getImage(design.generatedImage.id).then(b64 => {
            if (isMounted && b64) {
                setImageUrl(`data:${design.generatedImage.mimeType};base64,${b64}`);
            }
        }).catch(err => console.error("Failed to load image for card:", err));
        return () => { isMounted = false };
    }, [design]);

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 group">
          <button onClick={onClick} className="w-full text-left">
            <div className="relative w-full h-64 bg-slate-100 flex items-center justify-center">
              {imageUrl ? (
                  <img src={imageUrl} alt={design.style} className="w-full h-full object-cover" />
              ) : (
                  <SparklesIcon className="w-10 h-10 text-slate-300 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-bold">View Before & After</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-800 truncate">{design.style}</h3>
              <p className="text-sm text-slate-400">
                Saved on {new Date(design.timestamp).toLocaleDateString()}
              </p>
            </div>
          </button>
        </div>
    );
}

const MyDesignsView: React.FC<MyDesignsViewProps> = ({ designs }) => {
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [loadedModalImages, setLoadedModalImages] = useState<{original: string, generated: string} | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (selectedDesign) {
        setIsModalLoading(true);
        const fetchModalImages = async () => {
            try {
                const [originalB64, generatedB64] = await Promise.all([
                    dbService.getImage(selectedDesign.originalImage.id),
                    dbService.getImage(selectedDesign.generatedImage.id),
                ]);

                if (isMounted && originalB64 && generatedB64) {
                    setLoadedModalImages({
                        original: `data:${selectedDesign.originalImage.mimeType};base64,${originalB64}`,
                        generated: `data:${selectedDesign.generatedImage.mimeType};base64,${generatedB64}`,
                    });
                }
            } catch (e) {
                console.error("Failed to load images for modal", e);
            } finally {
                if (isMounted) setIsModalLoading(false);
            }
        };
        fetchModalImages();
    }
    return () => { isMounted = false; };
  }, [selectedDesign]);

  const handleCloseModal = () => {
      setSelectedDesign(null);
      setLoadedModalImages(null);
  };

  return (
    <div className="animate-fade-in-up">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">My Saved Designs</h2>
        <p className="mt-1 text-md text-slate-500">Your personal gallery of AI-generated ideas.</p>
      </header>

      {designs.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-lg">
          <BookmarkIcon className="mx-auto h-16 w-16 text-slate-400" />
          <p className="mt-4 text-xl text-slate-500">You have no saved designs.</p>
          <p className="text-slate-400">Go to the Designer to create and save your first design!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map(design => (
                <DesignCard key={design.id} design={design} onClick={() => setSelectedDesign(design)} />
            ))}
        </div>
      )}

      {selectedDesign && (
        <Modal isOpen={!!selectedDesign} onClose={handleCloseModal} title={`Design: ${selectedDesign.style}`}>
          <div className="space-y-4">
             {isModalLoading ? (
                <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
                    <SparklesIcon className="w-10 h-10 text-slate-300 animate-pulse" />
                </div>
            ) : loadedModalImages ? (
                <ImageComparator
                originalImage={loadedModalImages.original}
                generatedImage={loadedModalImages.generated}
                activeFilter="none"
                isSelectable={false}
                />
            ) : (
                <div className="w-full aspect-video bg-slate-100 flex items-center justify-center text-red-500">
                    <p>Could not load images.</p>
                </div>
            )}
            <p className="text-sm text-slate-500 text-center">
              Saved on {new Date(selectedDesign.timestamp).toLocaleString()}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyDesignsView;