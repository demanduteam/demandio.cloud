import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car, Globe, ChevronRight, Home, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_ARTICLE = {
    id: 'sample-2026',
    category: 'innovation',
    created_at: new Date().toISOString(),
    title_en: "Hydrogen Infrastructure Plan 2026",
    title_nl: "Waterstof Infrastructuur Plan 2026",
    desc_en: "The Dutch government has greenlit the 'H2-Mobility' subsidy for independent workshops.",
    desc_nl: "De Nederlandse overheid heeft groen licht gegeven voor de 'H2-Mobiliteit' subsidie.",
    slug: 'hydrogen-plan-2026',
    source: 'Demandio'
};

export default function News({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const ui: any = {
        en: { title: "Industry Updates", sub: "Real-time alerts on subsidies and automotive regulations.", read: "Read Article", load: "Loading updates..." },
        nl: { title: "Sector Updates", sub: "Real-time alerts over subsidies en automotive regelgeving.", read: "Lees Artikel", load: "Updates laden..." }
    };
    const t = ui[lang];

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'Published')
                .order('created_at', { ascending: false });
            
            setArticles((data && data.length > 0) ? data : [SAMPLE_ARTICLE]);
            setLoading(false);
        };
        fetchArticles();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
            <main className="flex-grow pt-12 pb-20 max-w-7xl mx-auto px-4 w-full">
                <header className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{t.title}</h1>
                    <p className="text-slate-400 font-medium text-lg">{t.sub}</p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                        {t.load}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((art: any) => {
                            const linkUrl = art.slug 
                                ? `/article?slug=${art.slug}&lang=${lang}` 
                                : `/article?id=${art.id}&lang=${lang}`;
                                
                            return (
                                <Link to={linkUrl} key={art.id} className="block animate-fade-in">
                                    <article className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4 block">{art.category}</span>
                                        <h2 className="text-xl font-extrabold mb-4 leading-tight text-slate-900">
                                            {lang === 'en' ? art.title_en : art.title_nl}
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
                                            {lang === 'en' ? art.desc_en : art.desc_nl}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                            <time className="text-[10px] font-black text-slate-300 uppercase">{new Date(art.created_at).toLocaleDateString()}</time>
                                            <span className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1">
                                                {t.read} <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
                
                <div className="flex justify-center border-t border-slate-100 pt-12 mt-12">
                    <Link to="/" className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition shadow-sm">
                        <Home size={20} /> Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
}
