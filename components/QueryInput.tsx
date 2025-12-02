
import React, { useState, useEffect } from 'react';

interface QueryInputProps {
  onSubmit: (query: string, attachments: File[]) => void;
  isLoading: boolean;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const fileToPreview = (file: File): string => URL.createObjectURL(file);

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const newPreviews = attachments.map(fileToPreview);
    setPreviews(newPreviews);
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(file => ALLOWED_IMAGE_TYPES.includes(file.type));
    setAttachments(prev => [...prev, ...imageFiles]);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    handleFiles(e.clipboardData.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || attachments.length > 0) {
      onSubmit(query, attachments);
      setQuery('');
      setAttachments([]);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex flex-col items-center space-y-2 bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200 ${isDragging ? 'border-purple-500 ring-2 ring-purple-500' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {attachments.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 p-2 bg-gray-800/50 rounded-t-md">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img src={preview} alt={`attachment ${index + 1}`} className="h-20 w-20 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove attachment"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full items-center space-x-3 p-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPaste={handlePaste}
          placeholder="Ask about a visual novel, or drop an image..."
          disabled={isLoading}
          className="flex-1 p-2 bg-transparent focus:ring-0 focus:outline-none transition duration-200 placeholder-gray-400 disabled:opacity-50 border-none"
        />
        <button
          type="submit"
          disabled={isLoading || (!query.trim() && attachments.length === 0)}
          className="p-3 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      {isDragging && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg pointer-events-none">
          <p className="text-white font-semibold">Drop image here</p>
        </div>
      )}
    </form>
  );
};
