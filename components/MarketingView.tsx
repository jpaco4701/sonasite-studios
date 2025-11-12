
import React, { useState } from 'react';
import { BusinessInfo } from '../types';
import { sonasiteAiService } from '../services/geminiService';
import { LoadingSpinner } from './icons';

interface CampaignAssets {
    googleAd: { headline: string; description: string; cta: string; };
    facebookPost: { text: string; imageDescription: string; };
    email: { subject: string; body: string; };
}

export const MarketingView: React.FC<{ businessInfo: BusinessInfo }> = ({ businessInfo }) => {
    const [campaignGoal, setCampaignGoal] = useState('');
    const [assets, setAssets] = useState<CampaignAssets | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaignGoal) return;
        setIsLoading(true);
        setAssets(null);
        try {
            const result = await sonasiteAiService.generateMarketingCampaign(businessInfo, campaignGoal);
            setAssets(result);
        } catch (error) {
            console.error("Failed to generate campaign:", error);
            // Handle error state in UI
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Generador de Campañas de Marketing con IA</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Describe tu objetivo y la IA generará el contenido para Google Ads, redes sociales y email.</p>
                <form onSubmit={handleGenerateCampaign} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={campaignGoal}
                        onChange={e => setCampaignGoal(e.target.value)}
                        placeholder="Ej: 'Oferta de lanzamiento -20%' o 'Promocionar nuevo servicio de consultoría'"
                        className="flex-grow p-3 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md"
                        required
                    />
                    <button type="submit" disabled={isLoading} className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-500 flex items-center gap-2">
                        {isLoading ? <LoadingSpinner className="w-5 h-5"/> : 'Generar Campaña'}
                    </button>
                </form>
            </div>

            {isLoading && (
                 <div className="text-center p-8">
                    <LoadingSpinner className="w-8 h-8 mx-auto text-primary" />
                    <p className="mt-2 text-gray-500">Generando activos de marketing...</p>
                 </div>
            )}

            {assets && (
                <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                    <CampaignCard title="Google Ad">
                        <p className="font-bold text-primary">{assets.googleAd.headline}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{assets.googleAd.description}</p>
                        <p className="mt-2 text-xs font-semibold uppercase">{assets.googleAd.cta}</p>
                    </CampaignCard>
                     <CampaignCard title="Publicación de Facebook">
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{assets.facebookPost.text}</p>
                        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-dark-700">
                             <p className="text-xs text-gray-500"><strong>Sugerencia de imagen:</strong> {assets.facebookPost.imageDescription}</p>
                        </div>
                    </CampaignCard>
                     <CampaignCard title="Email Promocional">
                        <p className="font-semibold text-gray-800 dark:text-white">{assets.email.subject}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{assets.email.body}</p>
                    </CampaignCard>
                </div>
            )}
        </div>
    );
};

const CampaignCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h4>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);
