import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aowhbzelvpnuonebefdx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvd2hiemVsdnBudW9uZWJlZmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODgyMzcsImV4cCI6MjA4MDI2NDIzN30.OZaNWGQV4CRxV9LgdJD5_RG2khJIJQiYHsLotwB6vwA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)