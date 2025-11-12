import React, { useState, useCallback } from 'react';
import { WebsiteData, BusinessInfo, WebsiteSection } from '../types';
import { EditorPanel } from './EditorPanel';
import { WebsitePreview } from './WebsitePreview';
import { CrmView } from './CrmView';
import { InvoicingView } from './InvoicingView';
import { MarketingView } from './MarketingView';

// Utility to set nested state immutably
const set = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop() as string;
    const lastObj = keys.reduce((o, key, i) => {
        if (o[key] === undefined) {
            const nextKey = keys[i+1] || lastKey;
            o[key] = /^\d+$/.test(nextKey) ? [] : {};
        }
        return o[key];
    }, obj);
    lastObj[lastKey] = value;
    return { ...obj };
};

export const EditorView: React.FC<{ initialWebsiteData: WebsiteData, businessInfo: BusinessInfo }> = ({ initialWebsiteData, businessInfo }) => {
    const [websiteData, setWebsiteData] = useState<WebsiteData>(initialWebsiteData);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'editor' | 'dashboard'>('editor');
    const [dashboardTab, setDashboardTab] = useState<'crm' | 'invoicing' | 'marketing'>('crm');
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const handleContentChange = useCallback((path: string, value: any) => {
        setWebsiteData(prevData => set(prevData, path, value));
    }, []);

    const handleAddSection = useCallback((type: WebsiteSection['type']) => {
        const newSection: WebsiteSection = {
            id: `${type}-${Date.now()}`,
            type: type,
            content: {
                title: 'New Section Title',
                text: 'This is some default text for your new section. Click to edit!',
                items: type === 'services' || type === 'testimonials' ? [{ title: 'New Item', description: 'Description' }] : [],
                images: type === 'gallery' ? ['https://picsum.photos/800/600'] : [],
            }
        };
        setWebsiteData(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                home: [...prev.pages.home, newSection]
            }
        }));
    }, []);

    const handleDeleteSection = useCallback((sectionId: string) => {
        setWebsiteData(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                home: prev.pages.home.filter(sec => sec.id !== sectionId)
            }
        }));
        if (selectedSectionId === sectionId) {
            setSelectedSectionId(null);
        }
    }, [selectedSectionId]);

    const handleAddListItem = useCallback((sectionId: string) => {
        const newSections = websiteData.pages.home.map(section => {
            if (section.id === sectionId) {
                const newItem = { title: 'New Item', description: 'New description', price: '$0' };
                return {
                    ...section,
                    content: {
                        ...section.content,
                        items: [...(section.content.items || []), newItem]
                    }
                };
            }
            return section;
        });
        setWebsiteData(prev => ({ ...prev, pages: { ...prev.pages, home: newSections } }));
    }, [websiteData.pages.home]);

    const handleDeleteListItem = useCallback((sectionId: string, itemIndex: number) => {
         const newSections = websiteData.pages.home.map(section => {
            if (section.id === sectionId) {
                const newItems = section.content.items?.filter((_, index) => index !== itemIndex);
                return { ...section, content: { ...section.content, items: newItems } };
            }
            return section;
        });
        setWebsiteData(prev => ({ ...prev, pages: { ...prev.pages, home: newSections } }));
    }, [websiteData.pages.home]);


    const renderDashboardContent = () => {
        switch (dashboardTab) {
            case 'crm': return <CrmView />;
            case 'invoicing': return <InvoicingView />;
            case 'marketing': return <MarketingView businessInfo={businessInfo}/>;
            default: return <CrmView />;
        }
    };

    return (
         <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-dark-800">
            <header className="bg-white dark:bg-dark-900 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{websiteData.businessName}</h1>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setCurrentView('editor')} className={`px-4 py-2 text-sm font-medium rounded-md ${currentView === 'editor' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>Editor</button>
                       <button onClick={() => setCurrentView('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-md ${currentView === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>Dashboard</button>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {currentView === 'editor' ? (
                     <div className="flex">
                        {isPanelOpen && (
                            <EditorPanel
                                websiteData={websiteData}
                                onAddSection={handleAddSection}
                                onDeleteSection={handleDeleteSection}
                                selectedSectionId={selectedSectionId}
                                setSelectedSectionId={setSelectedSectionId}
                                onTogglePanel={() => setIsPanelOpen(false)}
                                onContentChange={handleContentChange}
                            />
                        )}
                        <div className="flex-grow overflow-y-auto">
                            <WebsitePreview
                                websiteData={websiteData}
                                onContentChange={handleContentChange}
                                selectedSectionId={selectedSectionId}
                                setSelectedSectionId={setSelectedSectionId}
                                isPanelOpen={isPanelOpen}
                                onTogglePanel={() => setIsPanelOpen(true)}
                                onAddListItem={handleAddListItem}
                                onDeleteListItem={handleDeleteListItem}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
                        <div className="bg-white dark:bg-dark-900 rounded-lg shadow-lg p-6">
                            <div className="border-b border-gray-200 dark:border-dark-700 mb-6">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button onClick={() => setDashboardTab('crm')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${dashboardTab === 'crm' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>CRM</button>
                                    <button onClick={() => setDashboardTab('invoicing')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${dashboardTab === 'invoicing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Facturación</button>
                                    <button onClick={() => setDashboardTab('marketing')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${dashboardTab === 'marketing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Marketing</button>
                                </nav>
                            </div>
                            {renderDashboardContent()}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};