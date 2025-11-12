import React, { useState, useCallback, useEffect } from 'react';
import { AppState, BusinessInfo, WebsiteData } from './types';
import { sonasiteAiService } from './services/geminiService';
import { ArrowRightIcon, LoadingSpinner } from './components/icons';
import { EditorView } from './components/EditorView';

// --- Helper Components ---

interface InitialSetupProps {
  onGenerate: (info: BusinessInfo) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onGenerate }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('Español');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && type && location && language) {
      onGenerate({ name, type, location, language });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in px-4">
      <div className="w-full max-w-lg p-8 space-y-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Sonasite AI
            </h1>
          <p className="text-lg text-gray-600">
            Crea tu sitio web profesional en 30 segundos.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Nombre del negocio" value={name} onChange={setName} placeholder="Ej: Café Estelar" />
          <InputField label="Tipo de negocio" value={type} onChange={setType} placeholder="Ej: restaurante, consultor, tienda" />
          <InputField label="Ciudad/País" value={location} onChange={setLocation} placeholder="Ej: Barcelona, España" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition"
            >
              <option>Español</option>
              <option>English</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>Português</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!name || !type || !location}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Generar mi sitio web <ArrowRightIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition"
            required
        />
    </div>
);


const GeneratingView: React.FC = () => {
    const messages = [
        "Analizando tu tipo de negocio...",
        "Diseñando un layout profesional...",
        "Escribiendo copy persuasivo con IA...",
        "Seleccionando imágenes de alta calidad...",
        "Optimizando para SEO y móviles...",
        "Configurando formularios de contacto...",
        "Casi listo..."
    ];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 animate-fade-in">
            <LoadingSpinner className="w-16 h-16 text-purple-600 mb-6"/>
            <h2 className="text-3xl font-bold mb-4">Generando tu sitio web...</h2>
            <p className="text-lg text-gray-600">{message}</p>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.GATHERING_INFO);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);

  const handleGenerateWebsite = useCallback(async (info: BusinessInfo) => {
    setBusinessInfo(info);
    setAppState(AppState.GENERATING);
    const data = await sonasiteAiService.generateWebsiteContent(info);
    setWebsiteData(data);
    setAppState(AppState.VIEWING_SITE);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.GATHERING_INFO:
        return <InitialSetup onGenerate={handleGenerateWebsite} />;
      case AppState.GENERATING:
        return <GeneratingView />;
      case AppState.VIEWING_SITE:
        if (websiteData && businessInfo) {
            return <EditorView initialWebsiteData={websiteData} businessInfo={businessInfo}/>;
        }
        // Fallback if data is missing
        setAppState(AppState.GATHERING_INFO);
        return null;
      default:
        return <InitialSetup onGenerate={handleGenerateWebsite} />;
    }
  };

  return <div className="font-sans">{renderContent()}</div>;
};

export default App;