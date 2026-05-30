import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Newspaper, Plus, Edit2, Trash2, Save, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
    const [view, setView] = useState('list'); 
    const [activeTab, setActiveTab] = useState('articles');
    const [selectedArticle, setSelectedArticle] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'articles') {
            const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
            if (!error) setArticles(data || []);
        } else {
            const { data, error } = await supabase.from('subscribers').select('*').order('joined_at', { ascending: false });
            if (!error) setSubscribers(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this article?')) {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (!error) setArticles(articles.filter(a => a.id !== id));
        }
    };

    const handleEdit = (article: any) => {
        setSelectedArticle({
            ...article,
            title: { en: article.title_en || '', nl: article.title_nl || '' },
            desc: { en: article.desc_en || '', nl: article.desc_nl || '' },
            content: { en: article.content_en || '', nl: article.content_nl || '' }
        });
        setView('edit');
    };

    const handleAddNew = () => {
        setSelectedArticle({
            category: 'subsidy',
            read_time: '4 min read',
            source: 'Demandio',
            status: 'Draft',
            title: { en: '', nl: '' },
            desc: { en: '', nl: '' },
            content: { en: '', nl: '' }
        });
        setView('edit');
    };

    const Sidebar = () => (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen sticky top-0 p-6 flex flex-col shadow-sm">
            <Link to="/" className="flex items-center gap-2 mb-10 hover:opacity-80 transition">
                <div className="bg-blue-900 p-1.5 rounded-lg text-white"><LayoutDashboard size={20} /></div>
                <span className="font-black text-slate-900 text-lg tracking-tight">Demandio Admin</span>
            </Link>
            <nav className="space-y-1 flex-grow">
                <button onClick={() => { setActiveTab('articles'); setView('list'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'articles' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}><Newspaper size={18} /> News Hub</button>
                <button onClick={() => { setActiveTab('subscribers'); setView('list'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'subscribers' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}><Users size={18} /> Subscribers</button>
            </nav>
            <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">© 2026 Demandio</div>
        </aside>
    );

    const ArticleListView = () => (
        <div className="p-8 animate-fade-in-down w-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-slate-900">Articles</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition"><Plus size={20} /> New Post</button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400"><tr className="border-b"><th className="px-8 py-4">Title (EN)</th><th className="px-8 py-4">Category</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {articles.map(art => (
                            <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5"><p className="font-bold text-slate-900 text-sm">{art.title_en || 'Untitled'}</p></td>
                                <td className="px-8 py-5"><span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black uppercase text-slate-500">{art.category}</span></td>
                                <td className="px-8 py-5"><span className={`text-[10px] font-black uppercase ${art.status === 'Published' ? 'text-green-500' : 'text-orange-400'}`}>{art.status}</span></td>
                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(art)} className="p-2 text-slate-300 hover:text-blue-600 transition"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(art.id)} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && !loading && (
                            <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400">No articles found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const ArticleEditor = () => {
        const [form, setForm] = useState(selectedArticle);
        const [activeLang, setActiveLang] = useState('en');
        const activeLangRef = useRef(activeLang);
        const editorRef = useRef<HTMLDivElement>(null);
        const quillInstance = useRef<any>(null);

        useEffect(() => {
            activeLangRef.current = activeLang;
        }, [activeLang]);

        useEffect(() => {
            if (editorRef.current && !quillInstance.current && (window as any).Quill) {
                const Quill = (window as any).Quill;
                quillInstance.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: { toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean']] },
                    placeholder: 'Paste content here...'
                });
                
                quillInstance.current.root.innerHTML = form.content[activeLang] || '';
                
                quillInstance.current.on('text-change', () => {
                    const html = quillInstance.current.root.innerHTML;
                    const currentLang = activeLangRef.current;
                    setForm((prev: any) => ({ ...prev, content: { ...prev.content, [currentLang]: html } }));
                });
            }
        }, []);

        useEffect(() => {
            if (quillInstance.current) {
                const targetHtml = form.content[activeLang] || '';
                if (quillInstance.current.root.innerHTML !== targetHtml) {
                    quillInstance.current.root.innerHTML = targetHtml;
                }
            }
        }, [activeLang]);

        const handleSave = async () => {
            const dbPayload = {
                category: form.category,
                status: 'Published',
                source: form.source,
                read_time: form.read_time,
                title_en: form.title.en,
                title_nl: form.title.nl,
                desc_en: form.desc.en,
                desc_nl: form.desc.nl,
                content_en: form.content.en,
                content_nl: form.content.nl
            };

            let res;
            if (form.id && typeof form.id === 'string') {
                res = await supabase.from('articles').update(dbPayload).eq('id', form.id);
            } else {
                res = await supabase.from('articles').insert([dbPayload]);
            }

            if (!res.error) {
                fetchData();
                setView('list');
            } else {
                console.error("Save error:", res.error);
                alert("Error saving: " + res.error.message);
            }
        };

        return (
            <div className="p-8 animate-fade-in-down w-full max-w-6xl">
                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition"><ArrowLeft size={16} /> Back</button>
                    <button onClick={handleSave} className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg"><Save size={18} /> Save Article</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black">Editor</h2>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    {['en', 'nl'].map(l => (
                                        <button key={l} onClick={() => setActiveLang(l)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition ${activeLang === l ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6 border-b border-gray-100 pb-2">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Headline ({activeLang})</label>
                                    <input 
                                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition text-xl font-extrabold" 
                                        value={form.title[activeLang]} 
                                        onChange={e => setForm({...form, title: {...form.title, [activeLang]: e.target.value}})} 
                                        placeholder="Enter headline..." 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Summary ({activeLang})</label>
                                    <textarea 
                                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition h-20 text-sm font-medium" 
                                        value={form.desc[activeLang]} 
                                        onChange={e => setForm({...form, desc: {...form.desc, [activeLang]: e.target.value}})} 
                                        placeholder="Enter short summary..." 
                                    />
                                </div>
                                <div ref={editorRef} className="bg-white ql-editor min-h-[400px]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-10">
                            <h3 className="text-xs font-black mb-6 uppercase tracking-widest text-slate-400">Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Category</label>
                                    <select className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                        <option value="subsidy">Subsidy</option>
                                        <option value="regulation">Regulation</option>
                                        <option value="innovation">Innovation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Source</label>
                                    <input className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="Source..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Read Time</label>
                                    <input className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" value={form.read_time} onChange={e => setForm({...form, read_time: e.target.value})} placeholder="Read Time..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
            <Sidebar />
            <main className="flex-grow overflow-y-auto">
                {activeTab === 'subscribers' ? (
                    <div className="p-8 animate-fade-in-down w-full max-w-6xl">
                        <h1 className="text-3xl font-black mb-8 text-slate-900">Subscribers</h1>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400"><tr className="border-b"><th className="px-8 py-4">Email</th><th className="px-8 py-4">Joined</th></tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {subscribers.map(sub => (<tr key={sub.id} className="hover:bg-slate-50/50"><td className="px-8 py-5 font-bold text-sm text-slate-900">{sub.email}</td><td className="px-8 py-5 text-xs text-slate-400">{new Date(sub.joined_at).toLocaleDateString()}</td></tr>))}
                                    {subscribers.length === 0 && !loading && (
                                        <tr><td colSpan={2} className="px-8 py-10 text-center text-slate-400">No subscribers found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (view === 'list' ? <ArticleListView /> : <ArticleEditor />)}
            </main>
        </div>
    );
}
