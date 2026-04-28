import { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Bot, 
  ChevronRight, PhoneCall, ShieldAlert,
  Search, Menu, Clock, 
  CheckCircle2, FileText
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  intent?: string;
  kbArticle?: string;
  actions?: string[];
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'system',
      text: 'Chat started. AI Copilot is assisting the customer.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      sender: 'user',
      text: 'Why was my payment to Amazon declined yesterday?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4)
    },
    {
      id: '3',
      sender: 'bot',
      text: 'I can help look into that. I see a declined transaction for $142.50 at Amazon.com. It was declined because it triggered our suspected fraud alert due to an unusual location mismatch.',
      intent: 'transaction_declined',
      kbArticle: 'Handling Fraud Alerts (KB-1042)',
      actions: ['Verify transaction', 'Unblock card', 'Report fraud'],
      timestamp: new Date(Date.now() - 1000 * 60 * 3)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'active' | 'resolved' | 'escalated'>('active');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm looking into that for you.";
      let intent = "general_inquiry";
      let actions = ["Provide more details"];
      
      const lowerInput = newMsg.text.toLowerCase();
      if (lowerInput.includes('dispute') || lowerInput.includes('fraud')) {
        botResponse = "I understand you want to dispute this. I have initiated the dispute process. A temporary credit will be applied to your account within 24 hours while we investigate.";
        intent = "dispute_transaction";
        actions = ["View dispute status", "Upload receipt"];
      } else if (lowerInput.includes('unblock') || lowerInput.includes('verify')) {
        botResponse = "I have verified this transaction and unblocked your card. You can try the payment again.";
        intent = "card_unblock";
        actions = ["Confirm resolution"];
      } else if (lowerInput.includes('human') || lowerInput.includes('agent')) {
        botResponse = "I'm transferring you to a human agent who can help you further.";
        intent = "human_escalation";
        setStatus('escalated');
        actions = [];
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
        intent,
        actions
      }]);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      
      {/* LEFT SIDEBAR - History */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
            <ShieldAlert className="w-6 h-6" />
            <span>FinServe AI</span>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Sessions</h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">Sarah Jenkins</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-gray-500 truncate">Why was my payment to Amazon...</p>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">Michael Chang</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Waiting</span>
              </div>
              <p className="text-xs text-gray-500 truncate">I need to report a lost card.</p>
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-3">Recent History</h3>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-sm">Resolved Case #{8429 - i}</div>
                  <p className="text-xs text-gray-400 truncate">Fee reversal request</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-500">
          Agent: Jane Doe (Online)
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              SJ
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 leading-tight">Sarah Jenkins</h2>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online via Mobile App
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {status === 'active' && (
              <button onClick={() => setStatus('resolved')} className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-sm">
                Mark Resolved
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex max-w-3xl", msg.sender === 'user' ? "ml-auto justify-end" : "mr-auto", msg.sender === 'system' && "mx-auto justify-center max-w-full")}>
              
              {msg.sender === 'system' ? (
                <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {msg.text}
                </div>
              ) : (
                <div className={cn("flex gap-4", msg.sender === 'user' && "flex-row-reverse")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", 
                    msg.sender === 'user' ? "bg-slate-200 text-slate-600" : "bg-primary text-white"
                  )}>
                    {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  
                  <div className={cn("flex flex-col gap-1", msg.sender === 'user' ? "items-end" : "items-start")}>
                    <div className={cn("px-4 py-3 rounded-2xl max-w-xl text-sm shadow-sm",
                      msg.sender === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white border border-gray-100 rounded-tl-none text-slate-800"
                    )}>
                      {msg.text}
                    </div>
                    
                    {msg.sender === 'bot' && msg.intent && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                          Intent: {msg.intent.replace('_', ' ')}
                        </span>
                        {msg.kbArticle && (
                          <span className="text-[10px] flex items-center gap-1 font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-200">
                            <FileText className="w-3 h-3" /> {msg.kbArticle}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {msg.sender === 'bot' && msg.actions && msg.actions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {msg.actions.map(action => (
                          <button key={action} className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all flex items-center gap-1">
                            {action} <ChevronRight className="w-3 h-3 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          {status === 'escalated' ? (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">Conversation Escalatated</p>
                <p className="text-xs opacity-80">A human agent has been requested. Waiting for handoff...</p>
              </div>
            </div>
          ) : status === 'resolved' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">Conversation Resolved</p>
                <p className="text-xs opacity-80">This support ticket has been closed.</p>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message or use / to select a quick action..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SIDEBAR - Copilot Context */}
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col hidden lg:flex overflow-y-auto">
        <div className="p-5 border-b border-gray-200 bg-slate-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-primary" /> AI Copilot Insights
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-1">Detected Intent</div>
              <div className="font-medium text-sm text-gray-900">Transaction Decline Inquiry</div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '94%'}}></div>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 text-right">94% Confidence</div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-2">Customer Context</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type</span>
                  <span className="font-medium">Premium Checking</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenure</span>
                  <span className="font-medium">4.2 Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Score</span>
                  <span className="font-medium text-green-600">Low (12)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 mb-2">Monthly Activity</div>
              <div className="h-24 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{name: 'W1', val: 40}, {name: 'W2', val: 30}, {name: 'W3', val: 45}, {name: 'W4', val: 80}]}>
                    <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={{r: 2}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Suggested Responses</h4>
          <div className="space-y-2 mb-6">
            <button className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
              <div className="font-medium text-gray-800 mb-1 group-hover:text-primary">Confirm fraud & block</div>
              <div className="text-xs text-gray-500 line-clamp-2">"I'll go ahead and permanently block this card and issue a new one to your address on file."</div>
            </button>
            <button className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
              <div className="font-medium text-gray-800 mb-1 group-hover:text-primary">Verify & unblock</div>
              <div className="text-xs text-gray-500 line-clamp-2">"Thank you for confirming. I have unblocked your card and you can try the transaction again."</div>
            </button>
          </div>

          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">
            Knowledge Base <Search className="w-3 h-3" />
          </h4>
          <div className="space-y-3">
            <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg">
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-start gap-2">
                <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                Handling Fraud Alerts (KB-1042)
              </a>
              <p className="text-xs text-gray-500 mt-1 ml-6">Steps to verify out-of-pattern transactions and clear temporary blocks.</p>
            </div>
            <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg">
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-start gap-2">
                <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                Dispute Process Guide
              </a>
              <p className="text-xs text-gray-500 mt-1 ml-6">Standard SLA for provisional credits on verified disputed charges.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
