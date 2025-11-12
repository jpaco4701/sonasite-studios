import React, { useEffect } from 'react';
import { WebsiteData, WebsiteSection } from '../types';
import { HeaderSection, HeroSection, AboutSection, ServicesSection, GallerySection, TestimonialsSection, ContactSection, FooterSection } from './SectionComponents';
import { MagicWandIcon } from './icons';

interface WebsitePreviewProps {
    websiteData: WebsiteData;
    onContentChange: (path: string, value: any) => void;
    selectedSectionId: string | null;
    setSelectedSectionId: (id: string | null) => void;
    isPanelOpen: boolean;
    onTogglePanel: () => void;
    onAddListItem: (sectionId: string) => void;
    onDeleteListItem: (sectionId: string, itemIndex: number) => void;
}

const getContrastColor = (hex: string): string => {
    if (!hex || hex.length < 4) return '#000000';
    const hexVal = hex.startsWith('#') ? hex.substring(1) : hex;
    const fullHex = hexVal.length === 3 ? hexVal.split('').map(char => char + char).join('') : hexVal;
    if(fullHex.length !== 6) return '#000000';
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};


const EditableSection: React.FC<{
    section: WebsiteSection;
    children: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
    onImageChange: (path: string) => void;
    imagePath?: string;
}> = ({ section, children, isSelected, onClick, onImageChange, imagePath }) => {
    return (
        <div
            id={section.id}
            onClick={onClick}
            className={`relative outline-none transition-all duration-300 ${isSelected ? 'outline-dashed outline-2 outline-purple-500 outline-offset-4' : ''}`}
        >
            {isSelected && imagePath && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onImageChange(imagePath);
                    }}
                    className="absolute top-2 right-2 z-20 bg-white text-purple-600 px-3 py-1 rounded-md text-xs font-semibold shadow-lg hover:bg-purple-50"
                >
                    Edit Image
                </button>
            )}
            {children}
        </div>
    );
};


export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ websiteData, onContentChange, selectedSectionId, setSelectedSectionId, isPanelOpen, onTogglePanel, onAddListItem, onDeleteListItem }) => {

    useEffect(() => {
        const existingStyle = document.getElementById('dynamic-theme-styles');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'dynamic-theme-styles';
        style.innerHTML = `
            :root {
                --primary-color: ${websiteData.theme.primaryColor};
                --secondary-color: ${websiteData.theme.secondaryColor};
                --font-family: '${websiteData.theme.fontFamily}', sans-serif;
            }
            html { scroll-behavior: smooth; }
            body, .font-sans { font-family: var(--font-family); }
            .bg-primary { background-color: var(--primary-color); }
            .border-primary { border-color: var(--primary-color); }
        `;
        document.head.appendChild(style);
        
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${websiteData.theme.fontFamily.replace(/ /g, '+')}:wght@400;700;900&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        return () => {
            if(fontLink.parentNode) fontLink.parentNode.removeChild(fontLink);
        };

    }, [websiteData.theme]);
    
    const handleImageChange = (path: string) => {
        const newUrl = prompt("Enter new image URL:", "https://images.pexels.com/...");
        if (newUrl) {
            onContentChange(path, newUrl);
        }
    };

    const primaryContrastColor = getContrastColor(websiteData.theme.primaryColor);
    
    const primaryLuminance = ((): number => {
        const hex = websiteData.theme.primaryColor;
        if (!hex || hex.length < 4) return 0;
        const hexVal = hex.startsWith('#') ? hex.substring(1) : hex;
        const fullHex = hexVal.length === 3 ? hexVal.split('').map(char => char + char).join('') : hexVal;
        if (fullHex.length !== 6) return 0;
        const r = parseInt(fullHex.substring(0, 2), 16);
        const g = parseInt(fullHex.substring(2, 4), 16);
        const b = parseInt(fullHex.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    })();

    const isPrimaryColorTooLightForWhiteBg = primaryLuminance > 0.6;
    const safePrimaryTextColor = isPrimaryColorTooLightForWhiteBg ? websiteData.theme.secondaryColor : websiteData.theme.primaryColor;

    const renderSection = (section: WebsiteSection, index: number) => {
        const path = `pages.home.${index}.content`;
        const commonProps = {
            section,
            content: section.content,
            onContentChange,
            basePath: path,
            primaryContrastColor: primaryContrastColor,
            safePrimaryTextColor: safePrimaryTextColor,
            theme: websiteData.theme,
            onAddListItem,
            onDeleteListItem,
            onImageChange: handleImageChange
        };

        switch(section.type) {
            case 'header': return <HeaderSection {...commonProps} businessName={websiteData.businessName} />;
            case 'hero': return <HeroSection {...commonProps} />;
            case 'about': return <AboutSection {...commonProps} />;
            case 'services': return <ServicesSection {...commonProps} />;
            case 'gallery': return <GallerySection {...commonProps} />;
            case 'testimonials': return <TestimonialsSection {...commonProps} />;
            case 'contact': return <ContactSection {...commonProps} />;
            case 'footer': return <FooterSection {...commonProps} businessName={websiteData.businessName} />;
            default: return null;
        }
    };

    return (
        <div className="relative animate-fade-in bg-white dark:bg-dark-900 w-full">
            {!isPanelOpen && (
                <button
                    onClick={onTogglePanel}
                    className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
                    aria-label="Open Editor"
                >
                    <MagicWandIcon className="w-6 h-6" />
                </button>
            )}
            {websiteData.pages.home.map((section, index) => {
                const imagePath = section.content.imageUrl ? `pages.home.${index}.content.imageUrl` : undefined;
                return (
                    <EditableSection
                        key={section.id}
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        onClick={() => setSelectedSectionId(section.id)}
                        onImageChange={handleImageChange}
                        imagePath={imagePath}
                    >
                        {renderSection(section, index)}
                    </EditableSection>
                )
            })}
        </div>
    );
};