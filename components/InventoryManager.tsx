import React, { useState } from 'react';
import { InventoryItem, ImageFile } from '../types';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import { ArchiveBoxIcon, PlusCircleIcon } from './icons';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onUpdateInventory: (newInventory: InventoryItem[]) => void;
  activeItems: InventoryItem[];
  setActiveItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, onUpdateInventory, activeItems, setActiveItems }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState<ImageFile | null>(null);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemImage && newItemName) {
            const newItem: InventoryItem = {
                id: `inv-${Date.now()}`,
                name: newItemName,
                image: newItemImage,
            };
            onUpdateInventory([newItem, ...inventory]);
            setNewItemName('');
            setNewItemImage(null);
            setIsModalOpen(false);
        }
    };

    const toggleActiveItem = (item: InventoryItem) => {
        setActiveItems(prev => 
            prev.some(i => i.id === item.id) 
                ? prev.filter(i => i.id !== item.id) 
                : [...prev, item]
        );
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700 transition-colors">
                <ArchiveBoxIcon className="w-5 h-5" />
                <span>My Items</span>
                {activeItems.length > 0 && <span className="bg-teal-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeItems.length}</span>}
            </button>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="My Inventory">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">My Saved Items</h4>
                            {inventory.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {inventory.map(item => (
                                        <button key={item.id} onClick={() => toggleActiveItem(item)} className={`relative rounded-lg overflow-hidden border-4 ${activeItems.some(i => i.id === item.id) ? 'border-teal-500' : 'border-transparent'}`}>
                                            <img src={`data:${item.image.mimeType};base64,${item.image.base64}`} alt={item.name} className="w-full h-24 object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-end p-1">
                                                <p className="text-white text-xs font-bold truncate">{item.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">You haven't added any items yet.</p>
                            )}
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                             <h4 className="font-semibold text-slate-800 mb-2">Add New Item</h4>
                             <form onSubmit={handleAddItem} className="space-y-3">
                                <ImageUploader onImageUpload={setNewItemImage} disabled={false}>
                                    <div className="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                                        {newItemImage ? <img src={`data:${newItemImage.mimeType};base64,${newItemImage.base64}`} className="h-full w-full object-cover" /> : <PlusCircleIcon className="w-8 h-8"/>}
                                    </div>
                                </ImageUploader>
                                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item Name (e.g., Brown Leather Sofa)" required className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md" />
                                <button type="submit" disabled={!newItemImage || !newItemName} className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 disabled:bg-slate-400">Add to Inventory</button>
                             </form>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default InventoryManager;
