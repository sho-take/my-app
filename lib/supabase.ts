import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://stostxzaootpqcepleml.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0b3N0eHphb290cHFjZXBsZW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTgwMDIsImV4cCI6MjA1MTc3NDAwMn0.nWbMN9tgFak_-VAJaiHdS18yqLk-fbe21itx-kLtHE0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
