import React, { useState } from 'react';
import { WebsiteData, WebsiteSection } from '../types';
import { ArrowRightIcon } from './icons';

interface EditorPanelProps {
    websiteData: WebsiteData;
    onAddSection: (type: WebsiteSection['type']) => void;
    onDeleteSection: (id: string) => void;
    selectedSectionId: string | null;
    setSelectedSectionId: (id: string | null) => void;
    onTogglePanel: () => void;
    onContentChange: (path: string, value: any) => void;
}

type PanelView = 'sections' | 'add' | 'global' | 'edit-section';

const sectionTypeToName: Record<WebsiteSection['type'], string> = {
    header: 'Header',
    hero: 'Hero Banner',
    about: 'About Us',
    services: 'Services',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    contact: 'Contact Form',
    footer: 'Footer',
};

const availableSections: WebsiteSection['type'][] = ['about', 'services', 'gallery', 'testimonials', 'contact'];

const SectionSpecificEditor: React.FC<{ section: WebsiteSection, onContentChange: (path: string, value: any) => void, basePath: string }> = ({ section, onContentChange, basePath }) => {
    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-lg">{sectionTypeToName[section.type]}</h4>
            {section.content.navLinks && (
                <div>
                    <h5 className="font-semibold mb-2">Navigation Links</h5>
                    {section.content.navLinks.map((link, i) => (
                        <div key={i} className="mb-2 p-2 border rounded-md">
                             <label className="text-xs">Link Text</label>
                             <input type="text" value={link.name} onChange={e => onContentChange(`${basePath}.navLinks.${i}.name`, e.target.value)} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded-md text-gray-900"/>
                             <label className="text-xs mt-1">URL (e.g., #services)</label>
                             <input type="text" value={link.url} onChange={e => onContentChange(`${basePath}.navLinks.${i}.url`, e.target.value)} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded-md text-gray-900"/>
                        </div>
                    ))}
                </div>
            )}
            {section.content.links && (
                <div>
                    <h5 className="font-semibold mb-2">Social Links</h5>
                    {section.content.links.map((link, i) => (
                        <div key={i} className="mb-2 p-2 border rounded-md">
                             <label className="text-xs">Link Text</label>
                             <input type="text" value={link.name} onChange={e => onContentChange(`${basePath}.links.${i}.name`, e.target.value)} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded-md text-gray-900"/>
                             <label className="text-xs mt-1">Full URL</label>
                             <input type="text" value={link.url} onChange={e => onContentChange(`${basePath}.links.${i}.url`, e.target.value)} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded-md text-gray-900"/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ websiteData, onAddSection, onDeleteSection, selectedSectionId, setSelectedSectionId, onTogglePanel, onContentChange }) => {
    const [view, setView] = useState<PanelView>('sections');

    const selectedSection = websiteData.pages.home.find(sec => sec.id === selectedSectionId);
    const selectedSectionIndex = websiteData.pages.home.findIndex(sec => sec.id === selectedSectionId);

    const handleThemeChange = (field: string, value: string) => {
        onContentChange(`theme.${field}`, value);
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...websiteData.pages.home];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        // This is a direct state manipulation, so we can't use onContentChange easily.
        // A dedicated handler in the parent would be better, but for now this works.
        // A better approach would be `onStateChange('pages.home', newSections)`
        const newWebsiteData = {...websiteData, pages: {...websiteData.pages, home: newSections}};
        // setWebsiteData is not passed, so we construct the new state and call a generic change handler for the whole site.
        // This is a workaround. A proper implementation would have a setWebsiteData prop.
        // For now, let's assume this is handled by a different mechanism if needed, or we add a direct setter.
        // Since we don't have a direct setter, we can't implement move.
        // Let's remove the move buttons for now to avoid confusion.
    };
    
    const renderContent = () => {
        if(selectedSection) {
            return (
                <div>
                    <button onClick={() => setSelectedSectionId(null)} className="text-sm mb-4 text-purple-600">&larr; Back to Sections</button>
                    <SectionSpecificEditor section={selectedSection} onContentChange={onContentChange} basePath={`pages.home.${selectedSectionIndex}.content`} />
                </div>
            );
        }

        switch(view) {
            case 'global': return (
                <div className="space-y-4">
                    <h3 className="font-semibold">Theme Colors</h3>
                    <div>
                        <label className="text-sm">Primary Color</label>
                        <input type="color" value={websiteData.theme.primaryColor} onChange={e => handleThemeChange('primaryColor', e.target.value)} className="w-full mt-1 h-8" />
                    </div>
                    <div>
                        <label className="text-sm">Secondary Color</label>
                        <input type="color" value={websiteData.theme.secondaryColor} onChange={e => handleThemeChange('secondaryColor', e.target.value)} className="w-full mt-1 h-8" />
                    </div>
                    <h3 className="font-semibold pt-4">Typography</h3>
                    <div>
                        <label className="text-sm">Font Family</label>
                        <select value={websiteData.theme.fontFamily} onChange={e => handleThemeChange('fontFamily', e.target.value)} className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-md text-gray-900">
                            <option>Inter</option><option>Poppins</option><option>Lato</option><option>Roboto</option><option>Montserrat</option>
                        </select>
                    </div>
                </div>
            );
            case 'add': return (
                 <div>
                    <button onClick={() => setView('sections')} className="text-sm mb-4 text-purple-600">&larr; Back to Sections</button>
                    <h3 className="font-semibold mb-2">Add New Section</h3>
                    <div className="space-y-2">
                        {availableSections.map(type => (
                            <button key={type} onClick={() => { onAddSection(type); setView('sections'); }} className="w-full text-left p-3 rounded-md border border-gray-300 hover:bg-gray-100">
                                {sectionTypeToName[type]}
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 'sections':
            default: return (
                <div className="space-y-2">
                    <h3 className="font-semibold mb-2">Page Sections</h3>
                    {websiteData.pages.home.map((section) => (
                       <div key={section.id} onClick={() => setSelectedSectionId(section.id)} className={`p-3 rounded-md cursor-pointer border ${selectedSectionId === section.id ? 'bg-purple-500/10 border-purple-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                           <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{sectionTypeToName[section.type]}</span>
                                {section.type !== 'header' && section.type !== 'footer' && (
                                    <button onClick={(e) => {e.stopPropagation(); onDeleteSection(section.id)}} className="text-red-500 text-lg hover:text-red-700">&times;</button>
                                )}
                           </div>
                       </div>
                    ))}
                </div>
            );
        }
    };
    
    return (
        <aside className="w-80 bg-white text-gray-900 h-[calc(100vh-64px)] shadow-lg flex flex-col border-r border-gray-200 animate-fade-in">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Editor</h2>
                <button onClick={onTogglePanel} className="p-1 hover:bg-gray-200 rounded-md">&larr; Collapse</button>
            </div>
            {!selectedSection && (
                 <div className="p-4 flex gap-2 border-b border-gray-200">
                    <button onClick={() => setView('sections')} className={`flex-1 text-sm py-2 rounded-md ${view === 'sections' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-900'}`}>Sections</button>
                    <button onClick={() => setView('global')} className={`flex-1 text-sm py-2 rounded-md ${view === 'global' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-900'}`}>Global Styles</button>
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-4">
                {renderContent()}
            </div>
             <div className="p-4 border-t border-gray-200">
                <button onClick={() => setView('add')} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                    Add Section <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
};