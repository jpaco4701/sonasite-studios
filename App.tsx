import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, BusinessInfo, WebsiteData } from './types';
import { sonasiteAiService } from './services/geminiService';
import { ArrowRightIcon, LoadingSpinner, MagicWandIcon } from './components/icons';
import { EditorView } from './components/EditorView';

// --- Helper Components ---

interface InitialSetupProps {
  onGenerate: (info: BusinessInfo) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onGenerate }) => {
  const [step, setStep] = useState(0); // Use 0-based index
  const [info, setInfo] = useState({
    name: '',
    type: '',
    location: '',
    language: 'Español',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const steps = [
    {
      title: 'Crea un sitio web en 30 segundos con IA.',
      subtitle: 'Impulsado por el generador de sitios web con IA más potente del mundo.',
      field: 'type',
      placeholder: '¿Qué tipo de negocio estás construyendo?',
    },
    {
      title: `Excelente. ¿Cómo se llama tu ${info.type || 'negocio'}?`,
      field: 'name',
      placeholder: 'Ej: Café Estelar',
    },
    {
      title: '¡Entendido! ¿Dónde está ubicado tu negocio?',
      field: 'location',
      placeholder: 'Ej: Barcelona, España',
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const currentField = steps[step].field as keyof Omit<BusinessInfo, 'language'>;
    if (info[currentField]) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else if (info.location && info.language) {
        onGenerate(info);
      }
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const updateInfo = (field: keyof typeof info, value: string) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const currentStepInfo = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-white p-4 font-sans antialiased">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">SONASITE</h1>
        {step > 0 && (
          <button onClick={handleBack} className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Volver</button>
        )}
      </header>

      <main className="w-full max-w-xl px-4 flex-grow flex flex-col justify-center animate-fade-in">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
              {currentStepInfo.title}
            </h1>
            {currentStepInfo.subtitle && (
                <p className="text-lg text-gray-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {currentStepInfo.subtitle}
                </p>
            )}
        </div>
        
        <form onSubmit={handleNext} className="w-full space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={info[currentStepInfo.field as keyof Omit<BusinessInfo, 'language'>]}
              onChange={(e) => updateInfo(currentStepInfo.field as keyof BusinessInfo, e.target.value)}
              placeholder={currentStepInfo.placeholder}
              className="flex-grow px-5 py-4 bg-dark-800 border-2 border-dark-600 rounded-lg text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300"
              required
            />
            {!isLastStep && (
              <button
                type="submit"
                className="px-6 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                aria-label="Siguiente"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {isLastStep && (
            <>
              <select
                value={info.language}
                onChange={(e) => updateInfo('language', e.target.value)}
                className="w-full px-5 py-4 bg-dark-800 border-2 border-dark-600 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option>Español</option>
                <option>English</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>Português</option>
              </select>
              <button
                type="submit"
                disabled={!info.location || !info.language}
                className="w-full px-6 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Generar mi sitio web <ArrowRightIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </form>
        
        <div className="flex justify-center gap-2 mt-12">
            {steps.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-colors ${step >= index ? 'bg-purple-500' : 'bg-dark-600'}`}></div>
            ))}
        </div>
      </main>
      
      <footer className="w-full p-6 text-center text-gray-500 text-sm">
        <p>Únete a miles de negocios que crecen con Sonasite AI.</p>
      </footer>
    </div>
  );
};


const GeneratingView: React.FC = () => {
    const messages = [
        "Analizando tu tipo de negocio",
        "Diseñando un layout profesional",
        "Escribiendo copy persuasivo con IA",
        "Configurando imágenes de marcador",
        "Optimizando para SEO y móviles",
        "Configurando formularios de contacto",
        "Dando los toques finales",
    ];
    const [completedMessages, setCompletedMessages] = useState<string[]>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < messages.length) {
                setCompletedMessages(prev => [...prev, messages[index]]);
                index++;
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-white p-4 font-sans antialiased animate-fade-in">
            <div className="text-center">
                <div className="w-24 h-24 border-8 border-dark-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
                <h2 className="text-3xl font-bold mb-4">Generando tu sitio web...</h2>
                <p className="text-lg text-gray-400 mb-8">SONASITE AI está trabajando su magia.</p>
                
                <div className="text-left max-w-md mx-auto space-y-3">
                    {messages.map((msg, i) => {
                        const isCompleted = completedMessages.includes(msg);
                        return (
                            <div key={i} className="flex items-center gap-3 transition-opacity duration-500" style={{ opacity: isCompleted ? 1 : 0.5 }}>
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-dark-700'}`}>
                                    {isCompleted ? (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <LoadingSpinner className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <span className={`${isCompleted ? 'text-white' : 'text-gray-400'}`}>{msg}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
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