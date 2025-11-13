import React, { useState } from 'react';
import { WebsiteData, WebsiteSection } from '../types';
import { ArrowRightIcon, BriefcaseIcon, ChatAlt2Icon, ChevronDownIcon, ChevronUpIcon, MailIcon, PhotographIcon, UserIcon } from './icons';

interface EditorPanelProps {
    websiteData: WebsiteData;
    onAddSection: (type: WebsiteSection['type']) => void;
    onDeleteSection: (id: string) => void;
    onMoveSection: (index: number, direction: 'up' | 'down') => void;
    selectedSectionId: string | null;
    setSelectedSectionId: (id: string | null) => void;
    onTogglePanel: () => void;
    onContentChange: (path: string, value: any) => void;
}

type PanelView = 'sections' | 'add' | 'global';

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

const sectionIcons: Record<string, React.ReactNode> = {
    about: <UserIcon className="w-5 h-5 text-purple-600" />,
    services: <BriefcaseIcon className="w-5 h-5 text-purple-600" />,
    gallery: <PhotographIcon className="w-5 h-5 text-purple-600" />,
    testimonials: <ChatAlt2Icon className="w-5 h-5 text-purple-600" />,
    contact: <MailIcon className="w-5 h-5 text-purple-600" />,
};

const availableSections: WebsiteSection['type'][] = ['about', 'services', 'gallery', 'testimonials', 'contact'];

const SectionSpecificEditor: React.FC<{ section: WebsiteSection, onContentChange: (path: string, value: any) => void, basePath: string }> = ({ section, onContentChange, basePath }) => {
    const inputClasses = "w-full mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-purple-500 focus:border-purple-500";
    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">{sectionTypeToName[section.type]}</h4>
            {section.content.navLinks && (
                <div>
                    <h5 className="font-semibold mb-2 text-gray-600">Navigation Links</h5>
                    {section.content.navLinks.map((link, i) => (
                        <div key={i} className="mb-2 p-3 border rounded-lg bg-gray-50 space-y-2">
                             <div>
                                <label className="text-xs font-medium text-gray-500">Link Text</label>
                                <input type="text" value={link.name} onChange={e => onContentChange(`${basePath}.navLinks.${i}.name`, e.target.value)} className={inputClasses}/>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">URL (e.g., #services)</label>
                                <input type="text" value={link.url} onChange={e => onContentChange(`${basePath}.navLinks.${i}.url`, e.target.value)} className={inputClasses}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {section.content.links && (
                <div>
                    <h5 className="font-semibold mb-2 text-gray-600">Social Links</h5>
                    {section.content.links.map((link, i) => (
                         <div key={i} className="mb-2 p-3 border rounded-lg bg-gray-50 space-y-2">
                             <div>
                                <label className="text-xs font-medium text-gray-500">Link Text</label>
                                <input type="text" value={link.name} onChange={e => onContentChange(`${basePath}.links.${i}.name`, e.target.value)} className={inputClasses}/>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Full URL</label>
                                <input type="text" value={link.url} onChange={e => onContentChange(`${basePath}.links.${i}.url`, e.target.value)} className={inputClasses}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ websiteData, onAddSection, onDeleteSection, onMoveSection, selectedSectionId, setSelectedSectionId, onTogglePanel, onContentChange }) => {
    const [view, setView] = useState<PanelView>('sections');

    const selectedSection = websiteData.pages.home.find(sec => sec.id === selectedSectionId);
    const selectedSectionIndex = websiteData.pages.home.findIndex(sec => sec.id === selectedSectionId);

    const handleThemeChange = (field: string, value: string) => {
        onContentChange(`theme.${field}`, value);
    };
    
    const renderContent = () => {
        if(selectedSection) {
            return (
                <div>
                    <button onClick={() => setSelectedSectionId(null)} className="text-sm mb-4 font-semibold text-purple-600 hover:text-purple-800 transition-colors">&larr; Volver a Secciones</button>
                    <SectionSpecificEditor section={selectedSection} onContentChange={onContentChange} basePath={`pages.home.${selectedSectionIndex}.content`} />
                </div>
            );
        }

        switch(view) {
            case 'global': return (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Colores del Tema</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Primario</label>
                                <div className="flex items-center gap-2 border rounded-lg p-1 mt-1">
                                    <input type="color" value={websiteData.theme.primaryColor} onChange={e => handleThemeChange('primaryColor', e.target.value)} className="w-8 h-8 p-0 border-none rounded cursor-pointer" style={{backgroundColor: 'transparent'}} />
                                    <span className="font-mono text-sm text-gray-600">{websiteData.theme.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Secundario</label>
                                 <div className="flex items-center gap-2 border rounded-lg p-1 mt-1">
                                    <input type="color" value={websiteData.theme.secondaryColor} onChange={e => handleThemeChange('secondaryColor', e.target.value)} className="w-8 h-8 p-0 border-none rounded cursor-pointer" style={{backgroundColor: 'transparent'}} />
                                    <span className="font-mono text-sm text-gray-600">{websiteData.theme.secondaryColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Tipografía</label>
                        <div>
                            <label className="text-xs text-gray-500">Fuente</label>
                            <select value={websiteData.theme.fontFamily} onChange={e => handleThemeChange('fontFamily', e.target.value)} className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500">
                                <option>Inter</option><option>Poppins</option><option>Lato</option><option>Roboto</option><option>Montserrat</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
            case 'add': return (
                 <div className="animate-fade-in">
                    <button onClick={() => setView('sections')} className="text-sm mb-4 font-semibold text-purple-600 hover:text-purple-800 transition-colors">&larr; Volver a Secciones</button>
                    <h3 className="font-semibold mb-3 text-gray-800">Añadir Nueva Sección</h3>
                    <div className="space-y-2">
                        {availableSections.map(type => (
                            <button key={type} onClick={() => { onAddSection(type); setView('sections'); }} className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 flex items-center gap-3 transition-colors">
                                {sectionIcons[type]}
                                <span className="font-semibold text-gray-700">{sectionTypeToName[type]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
            case 'sections':
            default: return (
                <div className="space-y-2 animate-fade-in">
                    <h3 className="font-semibold mb-2 text-gray-800">Secciones de la Página</h3>
                    {websiteData.pages.home.map((section, index) => {
                       const isMovable = section.type !== 'header' && section.type !== 'footer';
                       const canMoveUp = isMovable && index > 1;
                       const canMoveDown = isMovable && index < websiteData.pages.home.length - 2;
                       return (
                           <div key={section.id} onClick={() => setSelectedSectionId(section.id)} className={`group p-3 rounded-lg cursor-pointer border-2 ${selectedSectionId === section.id ? 'bg-purple-50 border-purple-500' : 'border-transparent hover:bg-gray-100'}`}>
                               <div className="flex justify-between items-center">
                                   <span className="text-sm font-medium text-gray-800">{sectionTypeToName[section.type]}</span>
                                   <div className={`flex items-center gap-1 ${selectedSectionId === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                        {isMovable && (
                                            <>
                                                <button onClick={(e) => {e.stopPropagation(); onMoveSection(index, 'up')}} disabled={!canMoveUp} className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button onClick={(e) => {e.stopPropagation(); onMoveSection(index, 'down')}} disabled={!canMoveDown} className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button onClick={(e) => {e.stopPropagation(); onDeleteSection(section.id)}} className="p-1 rounded-md hover:bg-red-100 text-red-500 hover:text-red-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </>
                                        )}
                                   </div>
                               </div>
                           </div>
                       )
                    })}
                </div>
            );
        }
    };
    
    return (
        <aside className="w-80 bg-white text-gray-900 h-[calc(100vh-64px)] shadow-lg flex flex-col border-r border-gray-200 animate-fade-in">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Editor</h2>
                <button onClick={onTogglePanel} className="p-1 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-800 transition-colors">&larr; Ocultar</button>
            </div>
            {!selectedSection && (
                 <div className="p-2 flex gap-2 border-b border-gray-200 bg-gray-50">
                    <button onClick={() => setView('sections')} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${view === 'sections' ? 'bg-white shadow-sm text-purple-600' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}>Secciones</button>
                    <button onClick={() => setView('global')} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${view === 'global' ? 'bg-white shadow-sm text-purple-600' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}>Estilos</button>
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-4">
                {renderContent()}
            </div>
             <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setView('add')} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md">
                    Añadir Sección
                </button>
            </div>
        </aside>
    );
};