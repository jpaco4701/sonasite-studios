import React from 'react';
import { WebsiteSection, WebsiteData } from '../types';

interface SectionProps {
    section: WebsiteSection;
    content: WebsiteSection['content'];
    onContentChange: (path: string, value: any) => void;
    basePath: string;
    primaryContrastColor: string;
    safePrimaryTextColor: string;
    theme: WebsiteData['theme'];
    onAddListItem: (sectionId: string) => void;
    onDeleteListItem: (sectionId: string, itemIndex: number) => void;
    onImageChange: (path: string) => void;
}

const Editable: React.FC<{
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'button' | 'a';
    path: string;
    onContentChange: (path: string, value: any) => void;
    children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'onBlur' | 'contentEditable' | 'suppressContentEditableWarning'>> = ({ as: Component = 'div', path, onContentChange, children, ...rest }) => {
    return (
        <Component
            {...rest}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onContentChange(path, e.currentTarget.textContent || '')}
        >
            {children}
        </Component>
    );
};

const EditableImage: React.FC<{ path: string; onImageChange: (path: string) => void; src?: string; alt: string; className?: string }> = ({ path, onImageChange, src, alt, className }) => {
    return (
        <img
            src={src || 'https://via.placeholder.com/400'}
            alt={alt}
            className={`${className} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={(e) => {
                e.stopPropagation();
                onImageChange(path);
            }}
        />
    );
};

export const HeaderSection: React.FC<Omit<SectionProps, 'theme' | 'primaryContrastColor' | 'safePrimaryTextColor' | 'onAddListItem' | 'onDeleteListItem'> & { businessName: string, primaryContrastColor: string, safePrimaryTextColor: string }> = ({ content, onContentChange, basePath, businessName, onImageChange }) => (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm shadow-sm" id="header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <div className="flex items-center gap-2">
                {content.logoUrl && <EditableImage path={`${basePath}.logoUrl`} onImageChange={onImageChange} src={content.logoUrl} alt="logo" className="h-8" />}
                <Editable as="span" path={`${basePath}.businessName`} onContentChange={onContentChange} className="text-xl font-bold text-gray-800 dark:text-white">{businessName}</Editable>
            </div>
            <nav className="hidden md:flex items-center gap-6">
                {content.navLinks?.map((link, i) => (
                    <a key={i} href={link.url} className="text-gray-600 dark:text-gray-300 hover:text-purple-600">
                        <Editable as="span" path={`${basePath}.navLinks.${i}.name`} onContentChange={onContentChange}>{link.name}</Editable>
                    </a>
                ))}
            </nav>
            {content.ctaButton && (
                <a href={content.ctaButton.url} className="hidden md:block px-5 py-2 font-semibold rounded-md" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--primary-contrast-color)' }}>
                    <Editable as="span" path={`${basePath}.ctaButton.text`} onContentChange={onContentChange}>
                        {content.ctaButton.text}
                    </Editable>
                </a>
            )}
        </div>
    </header>
);

export const HeroSection: React.FC<SectionProps> = ({ content, onContentChange, basePath, primaryContrastColor }) => (
    <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center text-white" style={{ backgroundImage: `url(${content.imageUrl || 'https://picsum.photos/1920/1080'})` }} id="hero">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center animate-slide-up">
                <Editable as="h1" path={`${basePath}.title`} onContentChange={onContentChange} className="text-4xl md:text-6xl font-extrabold mb-4">{content.title}</Editable>
                <Editable as="p" path={`${basePath}.subtitle`} onContentChange={onContentChange} className="text-lg md:text-xl max-w-2xl mx-auto">{content.subtitle}</Editable>
                 {content.ctaButton && (
                    <a href={content.ctaButton.url} className="mt-8 inline-block px-8 py-3 font-bold rounded-full transition-transform transform hover:scale-105" style={{ backgroundColor: 'var(--primary-color)', color: primaryContrastColor }}>
                        <Editable as="span" path={`${basePath}.ctaButton.text`} onContentChange={onContentChange}>
                           {content.ctaButton.text}
                        </Editable>
                    </a>
                )}
            </div>
        </div>
    </div>
);

const Section: React.FC<{ id: string, children: React.ReactNode, className?: string, style?: React.CSSProperties}> = ({ id, children, className, style }) => (
    <section id={id} className={`py-12 md:py-20 ${className}`} style={style}>{children}</section>
);

export const AboutSection: React.FC<SectionProps> = ({ section, content, onContentChange, basePath, safePrimaryTextColor, onImageChange }) => (
    <Section id={section.type} className="bg-white dark:bg-dark-900 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
                <Editable as="h2" path={`${basePath}.title`} onContentChange={onContentChange} className="text-3xl font-bold mb-4" style={{ color: safePrimaryTextColor }}>{content.title}</Editable>
                <Editable as="p" path={`${basePath}.text`} onContentChange={onContentChange} className="text-lg leading-relaxed whitespace-pre-wrap">{content.text}</Editable>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <EditableImage path={`${basePath}.imageUrl`} onImageChange={onImageChange} src={content.imageUrl} alt="About us" className="rounded-lg shadow-2xl" />
            </div>
        </div>
    </Section>
);

export const ServicesSection: React.FC<SectionProps> = ({ section, content, onContentChange, basePath, safePrimaryTextColor, onAddListItem, onDeleteListItem }) => (
    <Section id={section.type} className="bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4 text-center">
            <Editable as="h2" path={`${basePath}.title`} onContentChange={onContentChange} className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{content.title}</Editable>
            <Editable as="p" path={`${basePath}.subtitle`} onContentChange={onContentChange} className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">{content.subtitle}</Editable>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.items?.map((item, index) => (
                    <div key={index} className="relative bg-white dark:bg-dark-700 p-8 rounded-lg shadow-lg text-left transform hover:-translate-y-2 transition-transform">
                        <button onClick={() => onDeleteListItem(section.id, index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button>
                        <Editable as="h3" path={`${basePath}.items.${index}.title`} onContentChange={onContentChange} className="text-xl font-bold mb-2" style={{ color: safePrimaryTextColor }}>{item.title}</Editable>
                        <Editable as="p" path={`${basePath}.items.${index}.description`} onContentChange={onContentChange} className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</Editable>
                        <Editable as="div" path={`${basePath}.items.${index}.price`} onContentChange={onContentChange} className="text-2xl font-bold text-gray-800 dark:text-white">{item.price}</Editable>
                    </div>
                ))}
            </div>
            <button onClick={() => onAddListItem(section.id)} className="mt-8 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">+ Add Service</button>
        </div>
    </Section>
);

export const GallerySection: React.FC<SectionProps> = ({ section, content, onContentChange, basePath, onImageChange }) => (
    <Section id={section.type} className="bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4 text-center">
            <Editable as="h2" path={`${basePath}.title`} onContentChange={onContentChange} className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">{content.title}</Editable>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.images?.map((img, index) => (
                    <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                        <EditableImage path={`${basePath}.images.${index}`} onImageChange={onImageChange} src={img} alt={`Gallery image ${index+1}`} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

export const TestimonialsSection: React.FC<SectionProps> = ({ section, content, onContentChange, basePath, safePrimaryTextColor, onAddListItem, onDeleteListItem }) => (
    <Section id={section.type} className="bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4 text-center">
             <Editable as="h2" path={`${basePath}.title`} onContentChange={onContentChange} className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">{content.title}</Editable>
             <div className="grid md:grid-cols-3 gap-8">
                {content.items?.map((item, index) => (
                    <div key={index} className="relative bg-white dark:bg-dark-700 p-8 rounded-lg shadow-lg">
                        <button onClick={() => onDeleteListItem(section.id, index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button>
                        <Editable as="p" path={`${basePath}.items.${index}.description`} onContentChange={onContentChange} className="text-gray-600 dark:text-gray-300 italic mb-4">"{item.description}"</Editable>
                        <Editable as="p" path={`${basePath}.items.${index}.title`} onContentChange={onContentChange} className="font-bold" style={{ color: safePrimaryTextColor }}>- {item.title}</Editable>
                    </div>
                ))}
             </div>
              <button onClick={() => onAddListItem(section.id)} className="mt-8 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">+ Add Testimonial</button>
        </div>
    </Section>
);

export const ContactSection: React.FC<SectionProps> = ({ section, content, onContentChange, basePath, primaryContrastColor, safePrimaryTextColor, theme }) => {
    const isPrimaryColorLight = (() => {
        const hex = theme.primaryColor.substring(1);
        if (hex.length < 6) return false;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    })();

    const inputClasses = isPrimaryColorLight
        ? "w-full px-4 py-3 bg-black/10 border border-black/20 rounded-md focus:ring-black/50 focus:border-black/50 placeholder-black/60 text-black"
        : "w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-white focus:border-white placeholder-white/70 text-white";

    return (
     <Section id={section.type} style={{ backgroundColor: 'var(--primary-color)', color: primaryContrastColor }}>
        <div className="container mx-auto px-4 text-center">
            <Editable as="h2" path={`${basePath}.title`} onContentChange={onContentChange} className="text-3xl font-bold mb-4">{content.title}</Editable>
            <Editable as="p" path={`${basePath}.text`} onContentChange={onContentChange} className="text-lg mb-8 max-w-2xl mx-auto">{content.text}</Editable>
            <div className="max-w-xl mx-auto">
                <form data-supabase="leads" data-business-id="{{BUSINESS_ID}}" className="space-y-4">
                    <input type="text" name="name" placeholder="Tu Nombre" required className={inputClasses}/>
                    <input type="email" name="email" placeholder="Tu Email" required className={inputClasses}/>
                    <textarea name="message" placeholder="Tu Mensaje" rows={4} className={inputClasses}></textarea>
                    <button type="submit" className="w-full px-8 py-3 bg-white font-bold rounded-md hover:bg-gray-200 transition-colors" style={{ color: safePrimaryTextColor }}>Enviar Mensaje</button>
                </form>
            </div>
        </div>
    </Section>
    );
}

export const FooterSection: React.FC<Omit<SectionProps, 'theme' | 'primaryContrastColor' | 'safePrimaryTextColor' | 'onAddListItem' | 'onDeleteListItem' | 'onImageChange'> & { businessName: string }> = ({ section, content, onContentChange, basePath, businessName }) => (
    <footer className="bg-dark-900 text-gray-400 py-8" id={section.type}>
        <div className="container mx-auto px-4 text-center">
            <Editable as="p" path={`${basePath}.text`} onContentChange={onContentChange} className="mb-4">{content.text || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`}</Editable>
            {content.links && content.links.length > 0 && (
                <div className="flex justify-center gap-6">
                    {content.links.map((link, i) => (
                         <a href={link.url} key={i} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                             <Editable as="span" path={`${basePath}.links.${i}.name`} onContentChange={onContentChange}>
                                {link.name}
                            </Editable>
                        </a>
                    ))}
                </div>
            )}
        </div>
    </footer>
);