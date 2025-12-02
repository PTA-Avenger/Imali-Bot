import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Cpu, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  AlertCircle,
  Menu,
  X,
  Server,
  FileText,
  Terminal,
  UploadCloud,
  CheckCircle,
  Loader,
  Globe,
  Lock,
  LogOut,
  UserPlus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- SUPABASE SIMULATION ---
// In a real environment, you would uncomment the following lines:
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// FOR PREVIEW ONLY: Mock Supabase Client
const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (callback) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email, password }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      if (email === 'admin@imali.com' && password === 'admin') {
        return { data: { user: { email, id: 'admin-123', role: 'admin' } }, error: null };
      }
      // Allow regular login for demo
      return { data: { user: { email, id: 'user-' + Date.now() } }, error: null };
    },
    signUp: async ({ email, password }) => {
       await new Promise(resolve => setTimeout(resolve, 800));
       return { 
         data: { user: { email, id: 'new-user-' + Date.now() }, session: null }, // Simulate email confirmation needed (no session)
         error: null 
       };
    },
    signOut: async () => {}
  }
};

// --- INTERNAL LOGIN COMPONENT ---
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      if (isSignUp) {
        // --- REGISTRATION LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) throw error;

        // Check if email confirmation is required (simulated by having user but no session)
        if (data.user && !data.session) {
          setMessage('Account created successfully! Please check your email to confirm.');
          setLoading(false);
          // Don't auto-login if confirmation is needed
          return;
        }
        
        if (data.user) {
          onLogin(data.user);
        }

      } else {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        }
        
        onLogin(data.user); 
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-full border border-slate-100">
      <div className="flex justify-center mb-6 text-blue-600">
        <div className="p-3 bg-blue-50 rounded-full">
          {isSignUp ? <UserPlus size={32} /> : <Lock size={32} />}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p className="text-center text-slate-500 mb-6 text-sm">
        {isSignUp 
          ? 'Register to access the Imali-Bot financial dashboard.' 
          : 'Sign in to access your financial dashboard.'}
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center">
          <AlertCircle size={16} className="mr-2 shrink-0"/>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 flex items-center">
          <CheckCircle size={16} className="mr-2 shrink-0"/>
          <span>{message}</span>
        </div>
      )}
      
      <form onSubmit={handleAuth}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center mt-2"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center space-y-3">
        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setMessage('');
          }} 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        
        <div className="pt-2 border-t border-slate-100">
           <button onClick={() => onLogin(null)} className="text-xs text-slate-400 hover:text-slate-600">
            Cancel and Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// --- LOCALIZATION DICTIONARY ---
const translations = {
  en: {
    dashboard: "Dashboard",
    assistant: "Financial Assistant",
    documents: "Documents",
    training: "Model Training",
    architecture: "Tech Architecture",
    revenue: "Total Revenue",
    expenses: "Expenses",
    automations: "Active Automations",
    anomalies: "Pending Anomalies",
    cashFlow: "Cash Flow Analysis",
    activities: "Recent System Activities",
    upload: "Upload Financial Records",
    systemOnline: "System Status: Online",
    socketConnected: "Socket.io: Connected",
    cobolActive: "COBOL Bridge: Active",
    greeting: "Hello! I am Imali-Bot. I can help you analyze cash flow, audit transactions, or predict future expenses.",
    placeholder: "Ask about revenue, expenses, or reports...",
    adminAccess: "Login / Register",
    signOut: "Sign Out"
  },
  zu: {
    dashboard: "Deshibhodi",
    assistant: "Umsizi Wezimali",
    documents: "Amadokhumenti",
    training: "Ukuqeqeshwa Kwemodeli",
    architecture: "Ingqalasizinda Yezobuchwepheshe",
    revenue: "Ingeniso Ephelele",
    expenses: "Izindleko",
    automations: "Imisebenzi Ezenzakalelayo",
    anomalies: "Okungavamile Okulindile",
    cashFlow: "Ukuhlaziywa Kwemali Engenayo",
    activities: "Imisebenzi Yesistimu Yakamuva",
    upload: "Layisha Amarekhodi Ezimali",
    systemOnline: "Isistimu: I-inthanethi",
    socketConnected: "Socket.io: Ixhunyiwe",
    cobolActive: "Ibhuloho le-COBOL: Lisebenzile",
    greeting: "Sawubona! Ngingu-Imali-Bot. Ngingakusiza ukuhlaziya ukuhamba kwemali noma ukuhlola ukuthengiselana.",
    placeholder: "Buza ngemali engenayo, izindleko, noma imibiko...",
    adminAccess: "Ngena / Bhalisa",
    signOut: "Phuma"
  },
  xh: {
    dashboard: "Ideshbhodi",
    assistant: "Umncedisi Wezemali",
    documents: "Amaxwebhu",
    training: "Uqeqesho Lwemodeli",
    architecture: "Uyilo Lwetekhnoloji",
    revenue: "Ingeniso Iyonke",
    expenses: "Inkcitho",
    automations: "Iinkqubo Ezizenzekelayo",
    anomalies: "Iingxaki Ezilindileyo",
    cashFlow: "Uhlalutyo Lwemali",
    activities: "Imisebenzi Yenqubo Yakamuva",
    upload: "Layisha Iirekhodi Zezemali",
    systemOnline: "Inkqubo: I-intanethi",
    socketConnected: "Socket.io: Ixhunyiwe",
    cobolActive: "Ibhulorho ye-COBOL: Isebenza",
    greeting: "Molo! Ndingu-Imali-Bot. Ndingakunceda uhlalutye ukuhamba kwemali okanye uqikelele inkcitho.",
    placeholder: "Buza malunga nengeniso, inkcitho, okanye iingxelo...",
    adminAccess: "Ngena / Bhalisa",
    signOut: "Phuma"
  },
  af: {
    dashboard: "Paneelbord",
    assistant: "Finansiële Assistent",
    documents: "Dokumente",
    training: "Model Opleiding",
    architecture: "Tegniese Argitektuur",
    revenue: "Totale Inkomste",
    expenses: "Uitgawes",
    automations: "Aktiewe Outomasies",
    anomalies: "Hangende Afwykings",
    cashFlow: "Kontantvloei Analise",
    activities: "Onlangse Stelsel Aktiwiteite",
    upload: "Laai Finansiële Rekords",
    systemOnline: "Stelsel Status: Aanlyn",
    socketConnected: "Socket.io: Gekoppel",
    cobolActive: "COBOL Brug: Aktief",
    greeting: "Hallo! Ek is Imali-Bot. Ek kan jou help om kontantvloei te ontleed of transaksies te oudit.",
    placeholder: "Vra oor inkomste, uitgawes of verslae...",
    adminAccess: "Teken In / Registreer",
    signOut: "Teken Uit"
  },
  st: {
    dashboard: "Dashboard",
    assistant: "Mothusi wa Ditjhelete",
    documents: "Dikomponeng",
    training: "Thupelo ya Mohlala",
    architecture: "Meralo ya Theknoloji",
    revenue: "Chelete e Kenang",
    expenses: "Ditshenyyehelo",
    automations: "Ditshebeletso tse Iketsetsang",
    anomalies: "Mathata a emetseng",
    cashFlow: "Tshekatsheko ya Phallo ya Tjhelete",
    activities: "Mesebetsi ya Haufinyane",
    upload: "Kenya Direkoto tsa Ditjhelete",
    systemOnline: "Sistimi: Inthaneteng",
    socketConnected: "Socket.io: E hokahantsoe",
    cobolActive: "Borogo ba COBOL: E sebetsa",
    greeting: "Dumela! Ke nna Imali-Bot. Nka o thusa ho hlahloba phallo ea chelete kapa ho rala bokamoso.",
    placeholder: "Botsa ka chelete e kenang, ditshenyyehelo...",
    adminAccess: "Kena / Ngolisa",
    signOut: "Tswa"
  }
};

// --- MOCK DATA ---
const revenueData = [
  { name: 'Mon', revenue: 4000, expenses: 2400 },
  { name: 'Tue', revenue: 3000, expenses: 1398 },
  { name: 'Wed', revenue: 2000, expenses: 9800 },
  { name: 'Thu', revenue: 2780, expenses: 3908 },
  { name: 'Fri', revenue: 1890, expenses: 4800 },
  { name: 'Sat', revenue: 2390, expenses: 3800 },
  { name: 'Sun', revenue: 3490, expenses: 4300 },
];

const mockNotifications = [
  { id: 1, type: 'alert', text: 'Unusual spike in operational expenses detected.' },
  { id: 2, type: 'success', text: 'Q3 Financial Report generated successfully.' },
  { id: 3, type: 'info', text: 'Model training completed: Accuracy 94%.' },
];

// --- MAIN APP COMPONENT ---
export default function ImaliBotApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeLang, setActiveLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Helper for translations
  const t = (key) => translations[activeLang][key] || translations['en'][key];

  // --- Auth Effect ---
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // If user logs in successfully, close modal
      if (session?.user) setShowLoginModal(false);
    });

    // Mock unsubscribe doesn't crash
    return () => {
      if(subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleManualLogin = (userData) => {
      // Used by the inline login component to update state when auth succeeds
      if (userData) {
          setUser(userData);
          setShowLoginModal(false);
      } else {
          setShowLoginModal(false); // Cancelled
      }
  }

  // --- Chat State ---
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: translations.en.greeting }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Language Switch
  const handleLangSwitch = (langCode) => {
    setActiveLang(langCode);
    setIsLangMenuOpen(false);
    const greeting = translations[langCode].greeting;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: greeting }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateMockResponse(newUserMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('revenue') || lowerInput.includes('money') || lowerInput.includes('imali')) return "Based on current trends, your projected revenue for next week is R14,200. This is a 12% increase from last week.";
    if (lowerInput.includes('expense') || lowerInput.includes('cost')) return "I've detected a recurring high expense in 'Cloud Infrastructure'. Would you like me to optimize this?";
    if (lowerInput.includes('report')) return "I'm generating the PDF report now using the template stored in MongoDB. It will be ready in a moment.";
    if (lowerInput.includes('train') || lowerInput.includes('model')) return "To retrain my predictive model, please visit the 'Model Training' tab in the settings. (Export available for Kaggle)";
    if (lowerInput.includes('cobol') || lowerInput.includes('legacy') || lowerInput.includes('mainframe')) return "I am bridged to the legacy COBOL mainframe (v85). I can retrieve transaction history dating back to 1998.";
    return "I'm processing that financial query against your local SQLite ledger and the COBOL Mainframe. One moment please...";
  };

  // --- Views ---

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Bot size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-wider">Imali-Bot</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden">
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2 flex-1">
        <button 
          onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <LayoutDashboard size={20} />
          <span>{t('dashboard')}</span>
        </button>
        <button 
          onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <MessageSquare size={20} />
          <span>{t('assistant')}</span>
        </button>
        <button 
          onClick={() => { setActiveTab('documents'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'documents' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <FileText size={20} />
          <span>{t('documents')}</span>
        </button>
        
        {/* Protected Admin Tabs - only show for specific admin email for demo purposes, or check role */}
        {user && user.email === 'admin@imali.com' && (
          <>
            <button 
              onClick={() => { setActiveTab('training'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'training' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Cpu size={20} />
              <span>{t('training')}</span>
            </button>
            
            <div className="pt-8 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
            <button 
              onClick={() => setShowTechStack(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <Server size={20} />
              <span>{t('architecture')}</span>
            </button>
          </>
        )}
      </nav>

      {/* Admin Login/Logout Button */}
      <div className="px-4 pb-4">
        {user ? (
          <button 
            onClick={() => {
              supabase.auth.signOut();
              setUser(null);
              setActiveTab('dashboard');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <LogOut size={20} />
            <span>{t('signOut')}</span>
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-800 transition-colors border border-dashed border-slate-700 hover:border-slate-500"
          >
            <Lock size={20} />
            <span>{t('adminAccess')}</span>
          </button>
        )}
      </div>

      <div className="p-6 bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-slate-400">{t('systemOnline')}</span>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-slate-400">{t('socketConnected')}</span>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-xs text-slate-400">{t('cobolActive')}</span>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('revenue')}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">R124,500.00</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('automations')}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">8 Workflows</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Next run in 15 mins
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('anomalies')}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3 Detected</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-amber-600 font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('chat')}>
            Ask Imali-Bot to investigate &rarr;
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('cashFlow')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('activities')}</h3>
          <div className="space-y-4">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className={`mt-0.5 w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <p className="text-sm text-slate-600">{notif.text}</p>
              </div>
            ))}
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-800 mb-1">SYSTEM NOTE</p>
              <p className="text-sm text-indigo-700">MongoDB Backup (Cluster 0) completed at 03:00 AM.</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-xs font-bold text-amber-800 mb-1">MAINFRAME LOG</p>
              <p className="text-sm text-amber-700">COBOL Batch Process #9923 finalized successfully.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center border-dashed border-2 border-slate-300 hover:border-blue-500 transition-colors cursor-pointer group">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t('upload')}</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
          Drag and drop PDF invoices, Excel spreadsheets, or scanned receipts here. 
          Imali-Bot will automatically extract data for analysis.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Browse Files
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Documents</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Q3_Financial_Summary.pdf', size: '2.4 MB', date: 'Today, 10:23 AM', status: 'processing' },
            { name: 'Vendor_Invoices_Sept.xlsx', size: '1.8 MB', date: 'Yesterday', status: 'completed' },
            { name: 'Bank_Statement_009.csv', size: '450 KB', date: 'Oct 24, 2023', status: 'completed' },
          ].map((doc, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.size} • Uploaded {doc.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                {doc.status === 'completed' ? (
                   <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                     <CheckCircle size={12} className="mr-1.5" /> Processed
                   </span>
                ) : (
                   <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                     <Loader size={12} className="mr-1.5 animate-spin" /> Scanning
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-800">{t('assistant')}</h2>
          <p className="text-xs text-green-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
            Model v2.4 Active
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
          Powered by Node.js & Socket.io
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 ml-2' : 'bg-blue-600 mr-2'}`}>
                {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-start max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-blue-600 mr-2 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );

  const TrainingView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center">
        <Cpu size={48} className="mx-auto text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">{t('training')}</h2>
        <p className="text-slate-500 max-w-lg mx-auto mt-2">
          Train your custom financial model using historical data from MongoDB and SQLite. 
          Adjust hyperparameters below to optimize for decision-making accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Training Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dataset Source</label>
              <select className="w-full p-2 border border-slate-200 rounded-md text-sm">
                <option>MongoDB: transactions_2023</option>
                <option>SQLite: local_ledger_v1</option>
                <option>Mainframe: COBOL_DUMP_01</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Epochs</label>
              <input type="range" className="w-full accent-indigo-600" min="10" max="1000" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
             <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Model Architecture</label>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">LSTM</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs border border-slate-200">Transformer</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs border border-slate-200">Regression</span>
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-4">
              Export Config for Kaggle
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4">Accuracy History</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {name: 'v1.0', acc: 75},
                  {name: 'v1.1', acc: 82},
                  {name: 'v1.2', acc: 88},
                  {name: 'v2.0', acc: 91},
                  {name: 'v2.1', acc: 94},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Bar dataKey="acc" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-100 flex items-center">
              <Activity size={16} className="mr-2" />
              Latest model (v2.1) shows 94% accuracy on test data.
            </div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <Loader size={32} className="text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-40">
           <div className="font-bold text-lg">Imali-Bot</div>
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu size={24} />
           </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {activeTab === 'dashboard' && t('dashboard')}
                  {activeTab === 'chat' && t('assistant')}
                  {activeTab === 'training' && t('training')}
                  {activeTab === 'documents' && t('documents')}
                </h1>
                <p className="text-slate-500 mt-1">
                  {activeTab === 'dashboard' && 'Real-time financial monitoring and automations.'}
                  {activeTab === 'chat' && 'Interacting with Neural Net v2.4 via Socket.io.'}
                  {activeTab === 'training' && 'Tune your financial prediction algorithms.'}
                  {activeTab === 'documents' && 'Upload and process invoices for automated analysis.'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                 {/* Language Switcher */}
                 <div className="relative">
                   <button 
                     onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                     className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                   >
                     <Globe size={16} />
                     <span className="uppercase">{activeLang}</span>
                   </button>
                   
                   {isLangMenuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                       <div className="py-1">
                         {[
                           {code: 'en', label: 'English'},
                           {code: 'zu', label: 'isiZulu'},
                           {code: 'xh', label: 'isiXhosa'},
                           {code: 'af', label: 'Afrikaans'},
                           {code: 'st', label: 'Sesotho'},
                           // Add other languages here...
                         ].map((lang) => (
                           <button
                             key={lang.code}
                             onClick={() => handleLangSwitch(lang.code)}
                             className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex justify-between items-center ${activeLang === lang.code ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-700'}`}
                           >
                             {lang.label}
                             {activeLang === lang.code && <CheckCircle size={14} />}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="hidden md:block">
                   <span className={`bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center ${user ? 'text-green-600' : 'text-slate-500'}`}>
                     <User size={14} className="mr-2" /> 
                     {user ? (user.email === 'admin@imali.com' ? 'Admin: Authenticated' : 'User: Authenticated') : 'Guest Access'}
                   </span>
                </div>
              </div>
            </div>

            {/* Views */}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'chat' && <ChatView />}
            {activeTab === 'training' && user && <TrainingView />}
            {activeTab === 'documents' && <DocumentsView />}
          </div>
        </main>
      </div>

      {/* Tech Stack Modal */}
      {showTechStack && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t('architecture')}</h2>
              <button onClick={() => setShowTechStack(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* ... Tech Stack Content ... */}
               <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-green-100 text-green-700 rounded mr-4"><Server size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Node.js & Express</h4>
                  <p className="text-sm text-slate-600">REST API for dashboard data and model serving.</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-blue-100 text-blue-700 rounded mr-4"><MessageSquare size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Socket.io</h4>
                  <p className="text-sm text-slate-600">Real-time bi-directional event-based communication for the chatbot.</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded mr-4"><Database size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">MongoDB & SQLite</h4>
                  <p className="text-sm text-slate-600">MongoDB for unstructured user logs; SQLite for transactional ledgers.</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-slate-800 text-white rounded mr-4"><Terminal size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">COBOL Legacy Bridge</h4>
                  <p className="text-sm text-slate-600">Interfacing with banking mainframes for historical ledger accuracy.</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                 <div className="p-2 bg-purple-100 text-purple-700 rounded mr-4"><Cpu size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Custom ML Model</h4>
                  <p className="text-sm text-slate-600">Python/TensorFlow model trained on financial datasets for decision support.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
              Imali-Bot Portfolio Project
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-slate-200"
            >
              <X size={24} />
            </button>
            <Login onLogin={handleManualLogin} />
          </div>
        </div>
      )}
    </div>
  );
}