import React, { useState } from 'react';
import { CrmContact } from '../types';

const sampleContacts: CrmContact[] = [
    { id: 1, name: 'Elena Rodriguez', email: 'elena.r@example.com', status: 'Customer', lastContacted: '2024-07-15' },
    { id: 2, name: 'Carlos Gomez', email: 'carlos.g@example.com', status: 'Lead', lastContacted: '2024-07-20' },
    { id: 3, name: 'Sofia Fernandez', email: 'sofia.f@example.com', status: 'Contacted', lastContacted: '2024-07-18' },
];

const StatusBadge: React.FC<{ status: CrmContact['status'] }> = ({ status }) => {
    const colorMap = {
        'Lead': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Contacted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Customer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorMap[status]}`}>{status}</span>
};

const AddContactModal: React.FC<{ onClose: () => void; onAddContact: (contact: Omit<CrmContact, 'id' | 'lastContacted'>) => void; }> = ({ onClose, onAddContact }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<CrmContact['status']>('Lead');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddContact({ name, email, status });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Añadir Nuevo Contacto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Estado</label>
                        <select value={status} onChange={e => setStatus(e.target.value as CrmContact['status'])} className="mt-1 w-full p-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md">
                            <option>Lead</option>
                            <option>Contacted</option>
                            <option>Customer</option>
                            <option>Lost</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-dark-600 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const CrmView: React.FC = () => {
    const [contacts, setContacts] = useState<CrmContact[]>(sampleContacts);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddContact = (newContact: Omit<CrmContact, 'id' | 'lastContacted'>) => {
        const newEntry: CrmContact = {
            ...newContact,
            id: contacts.length + 1,
            lastContacted: new Date().toISOString().split('T')[0],
        };
        setContacts([...contacts, newEntry]);
    };
    
    return (
        <div className="animate-fade-in">
             {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} onAddContact={handleAddContact} />}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Contactos</h3>
                <div>
                     <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">Añadir Contacto</button>
                </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Esta tabla está lista para ser conectada a una base de datos de Supabase.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                    <thead className="bg-gray-50 dark:bg-dark-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Último Contacto</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-700">
                        {contacts.map(contact => (
                            <tr key={contact.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{contact.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={contact.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{contact.lastContacted}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary hover:text-accent">Editar</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};