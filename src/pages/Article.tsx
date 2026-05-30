import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Home, Calendar, User, Share2, Check } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Article({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [searchParams] = useSearchParams();

    // SEO Injection Function
    const injectSEO = (data: any, currentLang: string) => {
        if (!data) return;
        
        const title = currentLang === 'en' ? data.title_en : data.title_nl;
        const desc = currentLang === 'en' ? data.desc_en : data.desc_nl;
        const url = window.location.href;

        document.title = `${title} | Demandio Insights`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", desc);
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) linkCanonical.setAttribute("href", url);
    };

    useEffect(() => {
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        const urlLang = searchParams.get('lang');
        
        if (urlLang && urlLang !== lang) {
            setLang(urlLang);
        }

        const fetchArticle = async () => {
            if (!id && !slug) {
                setLoading(false); 
                return;
            }

            let query = supabase.from('articles').select('*');
            
            if (slug) {
                query = query.eq('slug', slug);
            } else if (id) {
                query = query.eq('id', id);
            }

            const { data, error } = await query.single();

            if (data && !error) {
                setArticle(data);
                injectSEO(data, urlLang || lang);
            } else {
                setArticle({
                    id: 'mock',
                    slug: 'hydrogen-plan-2026',
                    title_en: "Hydrogen Infrastructure Plan 2026",
                    title_nl: "Waterstof Infrastructuur Plan 2026",
                    content_en: "<h2>The Future is Hydrogen</h2><p>As the Dutch government rolls out new subsidies...</p>",
                    content_nl: "<h2>De Toekomst is Waterstof</h2><p>Nu de Nederlandse overheid nieuwe subsidies uitrolt...</p>",
                    category: "Innovation",
                    author: "Dr. J. Willems",
                    source: "Ministerie I&W",
                    created_at: new Date().toISOString()
                });
            }
            setLoading(false);
        };

        fetchArticle();
    }, [searchParams]);

    useEffect(() => {
        if (article) injectSEO(article, lang);
    }, [lang, article]);

    const share = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-sans">Loading Article...</div>;
    if (!article) return <div className="h-screen flex items-center justify-center font-sans">Article Not Found. <Link to="/news" className="ml-2 text-blue-600 underline">Return to Hub</Link>.</div>;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800">
            {/* Content */}
            <main className="flex-grow pt-12 pb-20 max-w-3xl mx-auto px-6 animate-fade-in w-full">
                <header className="mb-10">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                        {article.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                        {lang === 'en' ? article.title_en : article.title_nl}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium border-y border-slate-100 py-4">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-blue-400" />
                            <span>{article.author || 'Demandio Editor'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-400" />
                            <time>{new Date(article.created_at).toLocaleDateString()}</time>
                        </div>
                        <div className="ml-auto">
                            <button onClick={share} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                                {copied ? <Check size={16}/> : <Share2 size={16} />}
                                <span className="text-xs font-bold uppercase">{copied ? 'Link Copied' : 'Share'}</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div 
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html: lang === 'en' ? article.content_en : article.content_nl }} 
                />
            </main>

            {/* Footer Nav */}
            <footer className="border-t border-slate-100 py-12 text-center bg-slate-50">
                <Link to="/" className="inline-flex items-center gap-2 font-bold text-slate-400 hover:text-slate-900 transition">
                    <Home size={16} /> Home
                </Link>
            </footer>
        </div>
    );
}
