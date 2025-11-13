import React, { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { supabaseService } from '../services/supabaseService';
import { LoadingSpinner } from './icons';


interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

export const InvoicingView: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }]);

     useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            const { data, error } = await supabaseService.getInvoices();
            if (error) {
                setError(error);
            } else {
                setInvoices(data || []);
            }
            setIsLoading(false);
        };
        fetchInvoices();
    }, []);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        const numValue = typeof value === 'string' ? (field === 'description' ? value : parseFloat(value)) : value;
        (newItems[index] as any)[field] = numValue;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };
    
    const resetForm = () => {
        setCustomerName('');
        setCustomerEmail('');
        setItems([{ description: '', quantity: 1, price: 0 }]);
    }

    const handleGenerateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        const total = calculateTotal();
        // FIX: The type `Omit<Invoice, 'id' | 'created_at'>` was incorrect because an `id` property was being assigned.
        // Changed to `Omit<Invoice, 'created_at'>` to allow for the client-side generated ID.
        const invoice: Omit<Invoice, 'created_at'> = {
            id: `INV-${Date.now()}`,
            customerName,
            customerEmail,
            items,
            total,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        
        const { data, error } = await supabaseService.addInvoice(invoice);
        if (error) {
            setError(error);
        } else if (data) {
            setInvoices(prev => [...prev, data]);
            resetForm();
        }
    };

    return (
        <div className="animate-fade-in grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Crear Nueva Factura</h3>
                <form onSubmit={handleGenerateInvoice} className="space-y-4 bg-gray-50 dark:bg-dark-800 p-6 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Cliente</label>
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 w-full p-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email del Cliente</label>
                        <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required className="mt-1 w-full p-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white pt-4">Ítems</h4>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" placeholder="Descripción" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-1/2 p-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                            <input type="number" placeholder="Cant." value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-1/4 p-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                            <input type="number" placeholder="Precio" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} className="w-1/4 p-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md"/>
                            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">&times;</button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="text-sm text-primary hover:underline">+ Añadir ítem</button>

                    <div className="text-right text-xl font-bold text-gray-800 dark:text-white pt-4">Total: ${calculateTotal().toFixed(2)}</div>
                    
                    <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700">
                        Guardar Factura
                    </button>
                </form>
            </div>
            
            <div>
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Facturas Existentes</h3>
                 {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                 <div className="space-y-4">
                     {isLoading ? <LoadingSpinner className="w-8 h-8 mx-auto text-primary"/> :
                        invoices.length > 0 ? (
                            invoices.map(invoice => (
                                <div key={invoice.id} className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">{invoice.customerName}</p>
                                            <p className="text-sm text-gray-500">{invoice.id} - Vence: {invoice.dueDate}</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">${invoice.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay facturas todavía.</p>
                        )
                    }
                 </div>
            </div>
        </div>
    );
};
