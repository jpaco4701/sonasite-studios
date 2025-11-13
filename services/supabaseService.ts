import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CrmContact, Invoice } from '../types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("Supabase URL or Anon Key is missing. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
}

const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error.message === 'string') return error.message;
    return 'An unknown error occurred.';
}

const createService = () => {
    const notConfiguredError = { data: null, error: 'Supabase no está configurado. Por favor, revisa tus variables de entorno.' };

    return {
        async getContacts(): Promise<{ data: CrmContact[] | null; error: string | null }> {
            if (!supabase) return notConfiguredError;
            const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
            return { data, error: error ? getErrorMessage(error) : null };
        },

        async addContact(contact: Omit<CrmContact, 'id' | 'created_at'>): Promise<{ data: CrmContact | null; error: string | null }> {
            if (!supabase) return notConfiguredError;
            const { data, error } = await supabase.from('contacts').insert(contact).select().single();
            return { data, error: error ? getErrorMessage(error) : null };
        },
        
        async getInvoices(): Promise<{ data: Invoice[] | null; error: string | null }> {
            if (!supabase) return notConfiguredError;
            const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
            return { data, error: error ? getErrorMessage(error) : null };
        },

        async addInvoice(invoice: Omit<Invoice, 'created_at'>): Promise<{ data: Invoice | null; error: string | null }> {
            if (!supabase) return notConfiguredError;
            const { data, error } = await supabase.from('invoices').insert(invoice).select().single();
            return { data, error: error ? getErrorMessage(error) : null };
        },
    };
};

export const supabaseService = createService();