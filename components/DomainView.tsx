
import React, { useState } from 'react';
import { LoadingSpinner } from './icons';

export const DomainView: React.FC = () => {
    const [domain, setDomain] = useState('');
    const [status, setStatus] = useState<'idle' | 'pending' | 'connected'>('idle');

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
            alert('Por favor, introduce un nombre de dominio válido.');
            return;
        }
        setStatus('pending');
    };

    const handleVerify = () => {
         // Simulate verification
        setStatus('connected');
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Conecta tu Dominio</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Publica tu sitio web en un dominio personalizado para darle un aspecto profesional. Primero, necesitas comprar un dominio en un registrador como GoDaddy o Namecheap.
                </p>
            </div>

            {status !== 'connected' && (
                 <div className="bg-gray-50 dark:bg-dark-800 p-6 rounded-lg border border-gray-200 dark:border-dark-700">
                    <form onSubmit={handleConnect} className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="text"
                            value={domain}
                            onChange={e => setDomain(e.target.value.toLowerCase())}
                            placeholder="ejemplo.com"
                            className="flex-grow w-full p-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"
                            required
                            disabled={status === 'pending'}
                        />
                        <button type="submit" disabled={status === 'pending'} className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-500">
                            {status === 'pending' ? 'Verificando...' : 'Conectar'}
                        </button>
                    </form>
                </div>
            )}


            {status === 'pending' && (
                <div className="animate-fade-in space-y-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Acción Requerida: Configura tu DNS</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Inicia sesión en tu proveedor de dominio y añade los siguientes registros para apuntar tu dominio a Sonasite. Los cambios pueden tardar hasta 24 horas en propagarse.
                    </p>
                    <div className="space-y-3 text-sm font-mono p-4 bg-gray-100 dark:bg-dark-700 rounded-md">
                        <div>
                            <p className="font-semibold text-gray-600 dark:text-gray-300">Registro A:</p>
                            <p>Tipo: <span className="text-primary font-semibold">A</span> | Nombre: <span className="text-primary font-semibold">@</span> | Valor: <span className="text-primary font-semibold">76.76.21.21</span></p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-600 dark:text-gray-300">Registro CNAME:</p>
                            <p>Tipo: <span className="text-primary font-semibold">CNAME</span> | Nombre: <span className="text-primary font-semibold">www</span> | Valor: <span className="text-primary font-semibold">{domain}</span></p>
                        </div>
                    </div>
                     <button onClick={handleVerify} className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">
                        He añadido los registros, Verificar
                    </button>
                </div>
            )}

             {status === 'connected' && (
                <div className="animate-fade-in bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
                     <h4 className="font-semibold text-green-800 dark:text-green-300">¡Dominio Conectado!</h4>
                     <p className="text-sm text-green-700 dark:text-green-400">
                        Felicidades, <span className="font-bold">{domain}</span> está ahora conectado. Tu sitio web está publicado y visible para todo el mundo.
                     </p>
                     <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-primary hover:underline font-semibold">
                        Visitar mi sitio &rarr;
                     </a>
                </div>
            )}
        </div>
    );
};
