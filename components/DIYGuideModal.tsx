
import React from 'react';
import Modal from './Modal';
import MessageRenderer from './MessageRenderer';
import { ClipboardCheckIcon } from './icons';

interface DIYGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const DIYGuideModal: React.FC<DIYGuideModalProps> = ({ isOpen, onClose, content }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI-Generated DIY Guide">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="flex items-center gap-3 mb-4 text-lg font-bold text-slate-800">
            <ClipboardCheckIcon className="w-8 h-8 text-teal-600"/>
            <h2>Your Step-by-Step Project Plan</h2>
        </div>
        <MessageRenderer text={content} />
      </div>
    </Modal>
  );
};

export default DIYGuideModal;
