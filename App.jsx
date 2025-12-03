import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, LayoutDashboard, Cpu, Send, Bot, User, TrendingUp, DollarSign, 
  Activity, AlertCircle, Menu, X, Server, FileText, Terminal, UploadCloud, 
  CheckCircle, Loader, Globe, Lock, LogOut, UserPlus, RefreshCw, BookOpen, ShieldCheck
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- ERROR BOUNDARY (Displays crash errors) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 h-screen flex flex-col items-center justify-center font-mono">
          <h1 className="text-3xl font-bold mb-4">⚠️ Application Crashed</h1>
          <p className="mb-4">Please report this error:</p>
          <div className="bg-white p-4 rounded border border-red-200 shadow-sm max-w-2xl overflow-auto">
            <pre className="text-sm">{this.state.error?.toString()}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- SUPABASE SIMULATION ---
const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (callback) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (email === 'admin@imali.com' && password === 'admin') {
        return { data: { user: { email, id: 'admin-123', role: 'admin' } }, error: null };
      }
      return { data: { user: { email, id: 'user-' + Date.now() } }, error: null };
    },
    signUp: async ({ email, password }) => {
       await new Promise(resolve => setTimeout(resolve, 800));
       return { data: { user: { email, id: 'new-user-' + Date.now() }, session: null }, error: null };
    },
    signOut: async () => {}
  }
};

// --- DATA & TRANSLATIONS ---
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

const translations = {
  en: {
    dashboard: "Dashboard", assistant: "Financial Assistant", documents: "Documents", training: "TRM-ACE Console", architecture: "Tech Architecture", revenue: "Total Revenue", expenses: "Expenses", automations: "Active Automations", anomalies: "Pending Anomalies", cashFlow: "Cash Flow Analysis", activities: "Recent System Activities", upload: "Upload Financial Records", systemOnline: "System Status: Online", socketConnected: "Socket.io: Connected", cobolActive: "COBOL Bridge: Active", greeting: "Hello! I am Imali-Bot. I can help you analyze cash flow, audit transactions, or predict future expenses.", placeholder: "Ask about revenue, expenses, or reports...", adminAccess: "Login / Register", signOut: "Sign Out"
  },
  zu: {
    dashboard: "Deshibhodi", assistant: "Umsizi Wezimali", documents: "Amadokhumenti", training: "I-Console ye-TRM-ACE", architecture: "Ingqalasizinda Yezobuchwepheshe", revenue: "Ingeniso Ephelele", expenses: "Izindleko", automations: "Imisebenzi Ezenzakalelayo", anomalies: "Okungavamile Okulindile", cashFlow: "Ukuhlaziywa Kwemali Engenayo", activities: "Imisebenzi Yesistimu Yakamuva", upload: "Layisha Amarekhodi Ezimali", systemOnline: "Isistimu: I-inthanethi", socketConnected: "Socket.io: Ixhunyiwe", cobolActive: "Ibhuloho le-COBOL: Lisebenzile", greeting: "Sawubona! Ngingu-Imali-Bot. Ngingakusiza ukuhlaziya ukuhamba kwemali noma ukuhlola ukuthengiselana.", placeholder: "Buza ngemali engenayo, izindleko, noma imibiko...", adminAccess: "Ngena / Bhalisa", signOut: "Phuma"
  },
};

const t = (lang, key) => translations[lang]?.[key] || translations['en'][key];

// --- EXTRACTED COMPONENTS ---

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setMessage('Account created successfully! Please check your email to confirm.');
          setLoading(false); return;
        }
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user); 
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-full border border-slate-100">
      <div className="flex justify-center mb-6 text-blue-600"><div className="p-3 bg-blue-50 rounded-full">{isSignUp ? <UserPlus size={32} /> : <Lock size={32} />}</div></div>
      <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
      <p className="text-center text-slate-500 mb-6 text-sm">{isSignUp ? 'Register to access Imali-Bot.' : 'Sign in to access your dashboard.'}</p>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center"><AlertCircle size={16} className="mr-2 shrink-0"/><span>{error}</span></div>}
      {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 flex items-center"><CheckCircle size={16} className="mr-2 shrink-0"/><span>{message}</span></div>}
      <form onSubmit={handleAuth} className="space-y-4">
        <input type="email" required placeholder="Email" className="w-full p-3 border border-slate-200 rounded-lg" onChange={(e) => setEmail(e.target.value)} value={email}/>
        <input type="password" required placeholder="Password" minLength={6} className="w-full p-3 border border-slate-200 rounded-lg" onChange={(e) => setPassword(e.target.value)} value={password}/>
        <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center">{loading ? <Loader size={20} className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}</button>
      </form>
      <div className="mt-6 text-center space-y-3">
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }} className="text-sm text-blue-600 hover:text-blue-800 font-medium">{isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}</button>
        <div className="pt-2 border-t border-slate-100"><button onClick={() => onLogin(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button></div>
      </div>
    </div>
  );
};

const DashboardView = ({ lang, setActiveTab }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500">{t(lang, 'revenue')}</p><h3 className="text-2xl font-bold text-slate-900 mt-1">R124,500.00</h3></div>
          <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={20} /></div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600"><TrendingUp size={16} className="mr-1" /><span>+12.5% from last month</span></div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500">{t(lang, 'automations')}</p><h3 className="text-2xl font-bold text-slate-900 mt-1">8 Workflows</h3></div>
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Activity size={20} /></div>
        </div>
        <div className="mt-4 text-sm text-slate-500">Next run in 15 mins</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500">{t(lang, 'anomalies')}</p><h3 className="text-2xl font-bold text-slate-900 mt-1">3 Detected</h3></div>
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertCircle size={20} /></div>
        </div>
        <div className="mt-4 text-sm text-amber-600 font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('chat')}>Ask Imali-Bot to investigate &rarr;</div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t(lang, 'cashFlow')}</h3>
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t(lang, 'activities')}</h3>
        <div className="space-y-4">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className={`mt-0.5 w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <p className="text-sm text-slate-600">{notif.text}</p>
            </div>
          ))}
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100"><p className="text-xs font-bold text-indigo-800 mb-1">SYSTEM NOTE</p><p className="text-sm text-indigo-700">MongoDB Backup (Cluster 0) completed at 03:00 AM.</p></div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100"><p className="text-xs font-bold text-amber-800 mb-1">MAINFRAME LOG</p><p className="text-sm text-amber-700">COBOL Batch Process #9923 finalized successfully.</p></div>
        </div>
      </div>
    </div>
  </div>
);

const ChatView = ({ lang, messages, inputValue, setInputValue, isTyping, handleSendMessage, messagesEndRef }) => (
  <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
      <div><h2 className="font-bold text-slate-800">{t(lang, 'assistant')}</h2><p className="text-xs text-green-600 flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>Model v2.4 Active</p></div>
      <div className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Powered by Node.js & Socket.io</div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 ml-2' : 'bg-blue-600 mr-2'}`}>{msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}</div>
            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>{msg.text}</div>
          </div>
        </div>
      ))}
      {isTyping && <div className="flex justify-start"><div className="flex items-start max-w-[80%]"><div className="w-8 h-8 rounded-full bg-blue-600 mr-2 flex items-center justify-center"><Bot size={14} className="text-white" /></div><div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm"><div className="flex space-x-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div></div></div></div></div>}
      <div ref={messagesEndRef} />
    </div>
    <div className="p-4 bg-white border-t border-slate-100">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t(lang, 'placeholder')} className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
        <button type="submit" disabled={!inputValue.trim()} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"><Send size={20} /></button>
      </form>
    </div>
  </div>
);

const DocumentsView = ({ lang }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center border-dashed border-2 border-slate-300 hover:border-blue-500 transition-colors cursor-pointer group">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><UploadCloud size={32} /></div>
      <h3 className="text-lg font-bold text-slate-900">{t(lang, 'upload')}</h3>
      <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">Drag and drop PDF invoices, Excel spreadsheets, or scanned receipts here.</p>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Browse Files</button>
    </div>
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-800">Recent Documents</h3></div>
      <div className="divide-y divide-slate-100">
        {[{ name: 'Q3_Financial_Summary.pdf', size: '2.4 MB', date: 'Today, 10:23 AM', status: 'processing' }, { name: 'Vendor_Invoices_Sept.xlsx', size: '1.8 MB', date: 'Yesterday', status: 'completed' }, { name: 'Bank_Statement_009.csv', size: '450 KB', date: 'Oct 24, 2023', status: 'completed' }].map((doc, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4"><div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><FileText size={20} /></div><div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.size} • Uploaded {doc.date}</p></div></div>
            <div className="flex items-center">{doc.status === 'completed' ? <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100"><CheckCircle size={12} className="mr-1.5" /> Processed</span> : <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"><Loader size={12} className="mr-1.5 animate-spin" /> Scanning</span>}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TrainingView = ({ lang }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center">
      <div className="flex justify-center items-center space-x-3 mb-4"><Cpu size={40} className="text-indigo-600" /><RefreshCw size={24} className="text-slate-400 animate-spin-slow" /><BookOpen size={40} className="text-emerald-600" /></div>
      <h2 className="text-2xl font-bold text-slate-900">{t(lang, 'training')}</h2>
      <p className="text-slate-500 max-w-2xl mx-auto mt-2 text-sm">Manage the <strong>Agentic Context Engineering (ACE)</strong> lifecycle.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Cpu size={18} className="mr-2 text-indigo-600" />TRM Configuration</h3>
        <div className="space-y-5">
          <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Base Model Selection</label><select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"><option>DeepSeek-V3 (7B) - Recommended</option><option>Mistral-Nemo (12B)</option><option>Llama-3 (8B) - Optimized</option></select><p className="text-[10px] text-slate-400 mt-1">*High-efficiency models (7B-13B) recommended.</p></div>
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm shadow-sm flex justify-center items-center"><RefreshCw size={16} className="mr-2" />Initialize TRM Session</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between"><div className="flex items-center"><Activity size={18} className="mr-2 text-indigo-600" />ACE Loop Performance</div><span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">Status: SELF-IMPROVING</span></h3>
         <div className="flex-1 min-h-[200px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{name:'C1',l:400,a:65},{name:'C2',l:350,a:72},{name:'C3',l:280,a:78},{name:'C4',l:150,a:85},{name:'C5',l:120,a:92},{name:'C6',l:85,a:96}]}><defs><linearGradient id="cL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient><linearGradient id="cA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" tick={{fontSize:10}} /><YAxis tick={{fontSize:10}} /><Tooltip /><Area type="monotone" dataKey="l" stroke="#f59e0b" fillOpacity={1} fill="url(#cL)" strokeWidth={2} /><Area type="monotone" dataKey="a" stroke="#4f46e5" fillOpacity={1} fill="url(#cA)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
         <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4"><div className="text-center"><p className="text-xs text-slate-400 uppercase">Generator</p><p className="font-bold text-slate-700">Idle</p></div><div className="text-center border-x border-slate-100"><p className="text-xs text-slate-400 uppercase">Reflector</p><p className="font-bold text-indigo-600 animate-pulse">Critiquing</p></div><div className="text-center"><p className="text-xs text-slate-400 uppercase">Curator</p><p className="font-bold text-slate-700">Ready</p></div></div>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
function ImaliBotApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeLang, setActiveLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([{ id: 1, sender: 'bot', text: translations.en.greeting }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) setShowLoginModal(false);
    });
    return () => { if(subscription) subscription.unsubscribe(); };
  }, []);

  const handleManualLogin = (userData) => {
      if (userData) { setUser(userData); setShowLoginModal(false); } else { setShowLoginModal(false); }
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleLangSwitch = (langCode) => {
    setActiveLang(langCode);
    setIsLangMenuOpen(false);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: translations[langCode].greeting }]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const API_URL = "https://ptaninja-imali-bot-api.hf.space/predict"; 
      const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ query: newUserMsg.text })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
         setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "I'm having trouble connecting to my Brain server. (Offline Mode)" }]);
         setIsTyping(false);
      }, 1000);
      return; 
    }
    setIsTyping(false);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader size={32} className="text-blue-600 animate-spin" /></div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-6 flex items-center justify-between"><div className="flex items-center space-x-2"><div className="bg-blue-500 p-2 rounded-lg"><Bot size={24} className="text-white" /></div><h1 className="text-xl font-bold tracking-wider">Imali-Bot</h1></div><button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden"><X size={24} /></button></div>
        <nav className="mt-6 px-4 space-y-2 flex-1">
          <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={20} /><span>{t(activeLang, 'dashboard')}</span></button>
          <button onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={20} /><span>{t(activeLang, 'assistant')}</span></button>
          <button onClick={() => { setActiveTab('documents'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'documents' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><FileText size={20} /><span>{t(activeLang, 'documents')}</span></button>
          {user && user.email === 'admin@imali.com' && (
            <>
              <button onClick={() => { setActiveTab('training'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'training' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Cpu size={20} /><span>{t(activeLang, 'training')}</span></button>
              <div className="pt-8 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
              <button onClick={() => setShowTechStack(true)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"><Server size={20} /><span>{t(activeLang, 'architecture')}</span></button>
            </>
          )}
        </nav>
        <div className="px-4 pb-4">
          {user ? <button onClick={() => { supabase.auth.signOut(); setUser(null); setActiveTab('dashboard'); }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors border border-slate-800"><LogOut size={20} /><span>{t(activeLang, 'signOut')}</span></button> : <button onClick={() => setShowLoginModal(true)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-800 transition-colors border border-dashed border-slate-700 hover:border-slate-500"><Lock size={20} /><span>{t(activeLang, 'adminAccess')}</span></button>}
        </div>
        <div className="p-6 bg-slate-950">
          <div className="flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-xs text-slate-400">{t(activeLang, 'systemOnline')}</span></div>
          <div className="flex items-center space-x-3 mt-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-xs text-slate-400">{t(activeLang, 'socketConnected')}</span></div>
          <div className="flex items-center space-x-3 mt-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-xs text-slate-400">{t(activeLang, 'cobolActive')}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-40"><div className="font-bold text-lg">Imali-Bot</div><button onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button></header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{activeTab === 'dashboard' && t(activeLang, 'dashboard')}{activeTab === 'chat' && t(activeLang, 'assistant')}{activeTab === 'training' && t(activeLang, 'training')}{activeTab === 'documents' && t(activeLang, 'documents')}</h1>
                <p className="text-slate-500 mt-1">{activeTab === 'dashboard' && 'Real-time financial monitoring.'}{activeTab === 'chat' && 'AI-driven analysis.'}{activeTab === 'training' && 'Model optimization.'}{activeTab === 'documents' && 'Invoice processing.'}</p>
              </div>
              <div className="flex items-center space-x-3">
                 <div className="relative">
                   <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm"><Globe size={16} /><span className="uppercase">{activeLang}</span></button>
                   {isLangMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden"><div className="py-1">{['en', 'zu'].map(l => <button key={l} onClick={() => handleLangSwitch(l)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">{l.toUpperCase()}</button>)}</div></div>}
                 </div>
                 <div className="hidden md:block"><span className={`bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center ${user ? 'text-green-600' : 'text-slate-500'}`}><User size={14} className="mr-2" />{user ? (user.email === 'admin@imali.com' ? 'Admin' : 'User') : 'Guest'}</span></div>
              </div>
            </div>

            {activeTab === 'dashboard' && <DashboardView lang={activeLang} setActiveTab={setActiveTab} />}
            {activeTab === 'chat' && <ChatView lang={activeLang} messages={messages} inputValue={inputValue} setInputValue={setInputValue} isTyping={isTyping} handleSendMessage={handleSendMessage} messagesEndRef={messagesEndRef} />}
            {activeTab === 'training' && user && <TrainingView lang={activeLang} />}
            {activeTab === 'documents' && <DocumentsView lang={activeLang} />}
          </div>
        </main>
      </div>

      {showTechStack && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowTechStack(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-4">Tech Architecture</h2>
            <p className="text-sm text-slate-500">Node.js, React, Supabase, Hugging Face (TRM-Ace Model)</p>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute -top-12 right-0 text-white hover:text-slate-200"><X size={24} /></button>
            <Login onLogin={handleManualLogin} />
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap the main app in the ErrorBoundary
export default function App() {
  return (
    <ErrorBoundary>
      <ImaliBotApp />
    </ErrorBoundary>
  );
}
