import React from 'react';
import type { SidebarItem } from '../types';
import { VnCard } from './VnCard';
import { CharacterCard } from './CharacterCard';
import { ReleaseCard } from './ReleaseCard';
import { ProducerCard } from './ProducerCard';
import { StaffCard } from './StaffCard';
import { TagCard } from './TagCard';
import { TraitCard } from './TraitCard';
import { QuoteCard } from './QuoteCard';


interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-1/3 max-w-md h-screen bg-gray-800/50 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-center text-gray-300">Retrieved Information</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            <p>Data from VNDB will appear here...</p>
          </div>
        ) : (
          items.map((item, index) => {
            if (!item || typeof item !== 'object' || !('type' in item)) return null;

            switch (item.type) {
              case 'vn':
                return <VnCard key={item.id || index} data={item} />;
              case 'character':
                return <CharacterCard key={item.id || index} data={item} />;
              case 'release':
                return <ReleaseCard key={item.id || index} data={item} />;
              case 'producer':
                return <ProducerCard key={item.id || index} data={item} />;
              case 'staff':
                return <StaffCard key={item.id || index} data={item} />;
              case 'tag':
                return <TagCard key={item.id || index} data={item} />;
              case 'trait':
                return <TraitCard key={item.id || index} data={item} />;
              case 'quote':
                return <QuoteCard key={item.id || index} data={item} />;
              default:
                // This will help catch any unhandled item types during development
                console.warn('Unhandled sidebar item type:', (item as any).type);
                return null;
            }
          })
        )}
      </div>
    </aside>
  );
};