import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Wrench, Car, Settings, Briefcase, ChevronRight, CheckCircle, Globe, 
    ArrowRight, Loader2, Network, TrendingUp, BarChart3, Package, 
    GraduationCap, Euro, FileText, Send, HelpCircle,  Zap, 
    Truck, Mic, QrCode, Smartphone, ListChecks, Barcode, Grid, 
    FileBarChart, Trash2, Receipt, Newspaper, ExternalLink, Quote, 
    Users, Layout, Building2, Landmark, Factory, Award, Leaf, Link as LinkIcon, Menu, X, ShieldCheck, RefreshCw, PieChart, Database, MapPin, User, Video
} from 'lucide-react';

export default function Home({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
    const [activeRole, setActiveRole] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({ 
        name: '', email: '', company: '', city: '', role: '', customRole: '', newsletter: false
    });
    const [formStatus, setFormStatus] = useState('idle');

    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'Published')
                .order('created_at', { ascending: false })
                .limit(3);

            if (!error && data) setNewsItems(data);
            setLoadingNews(false);
        };
        fetchNews();
    }, []);

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        setFormStatus('submitting');
        try {
            const finalRole = formData.role === 'other' ? formData.customRole : formData.role;
            const { error } = await supabase.from('leads').insert([{
                full_name: formData.name, email: formData.email, company_name: formData.company,
                city: formData.city, user_role: finalRole, newsletter_opt_in: formData.newsletter
            }]);
            if (error) throw error;
            setFormStatus('success');
            setTimeout(() => { navigate('/tools'); }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Er is iets misgegaan. Probeer het later opnieuw.");
            setFormStatus('idle');
        }
    };

    const content: any = {
        en: {
            nav: { solutions: "Solutions", pillars: "Ecosystem", news: "News", subsidy_guide: "The Journey", contact: "Contact", tools: "Tools" },
            hero: { title: "The Operating System for the Sustainable Aftermarket", subtitle: "Unifying Garages, Networks, and Wholesalers. We turn compliance data into profit, sustainability into strategy, and chaos into clarity.", cta: "Explore Ecosystem Solutions", trust: "Empowering the entire Dutch automotive chain: From Bay to Boardroom." },
            stats: { stat1: "€2.4M+ Value Created", stat2: "150+ Partners Connected", stat3: "CSRD Ready Data" },
            roles: { title: "Select your position in the ecosystem", section_operational: "Operational Excellence (Garage Level)", section_strategic: "Strategic Leadership (Network Level)", garage_owner: "Garage Owner", advisor: "Service Advisor", mechanic: "Mechanic", warehouse: "Warehouse Mgr.", financial: "Accountant/Admin", formula_manager: "Formula Manager", association: "Association (BOVAG/RAI)", wholesaler: "Wholesaler" },
            solutions: { title: "Your Digital Toolkit", back: "Choose a different role", cta_button: "Start Pilot", cta_desc: "Ready to optimize?" },
            pillars: { title: "One Platform, Four Pillars of Value", subtitle: "How we drive the industry forward aligned with Dutch goals.", p1_title: "Profit & Subsidies", p1_desc: "Automated scanning for MIA/Vamil, SEBA, and SLIM. Don't leave government money on the table.", p2_title: "Sustainability & ESG", p2_desc: "VSME & CSRD reporting made easy. Track CO2, waste, and circularity for bank loans and compliance.", p3_title: "Operational Efficiency", p3_desc: "Digital tools for mechanics and warehouses. Reduce error rates and logistics losses (Cores).", p4_title: "Strategic Intelligence", p4_desc: "Real-time benchmarking and trend analysis for networks and associations to lead the market." },
            news: { title: "Market Intelligence & Regulatory Updates", subtitle: "Stay ahead of Dutch laws, EU Directives, and Tech Trends.", read_more: "Read Analysis", loading: "Loading latest updates...", empty: "No news available at the moment." },
            roadmap: { title: "The Path to a Future-Proof Business", subtitle: "Whether you fix cars or manage a network, here is how we upgrade you.", step1: "Connect & Scan", step1_desc: "Link your DMS or purchasing data. We scan for hidden opportunities (Money/Efficiency).", step2: "Analyze & Benchmark", step2_desc: "AI compares your performance against the market. Identify gaps in ESG or Profit.", step3: "Optimize & Comply", step3_desc: "Actionable tools: Auto-generate ESG reports, apply for subsidies, or train staff.", step4: "Grow & Report", step4_desc: "Showcase your 'Green Score' to customers and banks. Unlock better financing.", cta: "Start Your Journey" },
            form: { title: "Join the Ecosystem", subtitle: "Request a tailored demo for your specific role.", name: "Full Name", email: "Work Email", company: "Company / Organization", city: "City", role: "Your Role", role_placeholder: "Select your role...", role_other: "Other", custom_role_placeholder: "e.g., Policy Maker", newsletter: "Send me the 'Aftermarket 2030' whitepaper.", submit: "Request Access", submitting: "Processing...", success: "Thank you. Redirecting to tools..." },
            footer: { rights: "© 2026 Demandio Netherlands. Empowering the Transition." }
        },
        nl: {
            nav: { solutions: "Oplossingen", pillars: "Ecosysteem", news: "Nieuws", subsidy_guide: "De Reis", contact: "Contact", tools: "Hulpmiddelen" },
            hero: { title: "Het Besturingssysteem voor de Duurzame Aftermarket", subtitle: "Verenigt Garages, Netwerken en Grossiers. Wij zetten compliance data om in winst, duurzaamheid in strategie, en chaos in inzicht.", cta: "Ontdek Ecosysteem Oplossingen" },
            stats: { stat1: "€2.4M+ Waarde Gecreëerd", stat2: "150+ Partners Aangesloten", stat3: "CSRD-Klaar Data" },
            roles: { title: "Kies uw positie in het ecosysteem", section_operational: "Operationele Excellentie (Garage Niveau)", section_strategic: "Strategisch Leiderschap (Netwerk Niveau)", garage_owner: "Garagehouder", advisor: "Service Adviseur", mechanic: "Monteur", warehouse: "Magazijn Manager", financial: "Boekhouder / Admin", formula_manager: "Formule Manager", association: "Branchevereniging (BOVAG)", wholesaler: "Grossier / Distributeur" },
            solutions: { title: "Uw Digitale Gereedschapskist", back: "Kies een andere rol", cta_button: "Start Pilot", cta_desc: "Klaar voor optimalisatie?" },
            pillars: { title: "Eén Platform, Vier Waardepijlers", subtitle: "Hoe wij de industrie vooruit helpen in lijn met Nederlandse doelen.", p1_title: "Winst & Subsidies", p1_desc: "Automatische scan voor MIA/Vamil, SEBA en SLIM. Laat geen overheidsgeld liggen.", p2_title: "Duurzaamheid & ESG", p2_desc: "VSME & CSRD rapportage eenvoudig gemaakt. Volg CO2, afval en circulariteit voor bankleningen.", p3_title: "Operationele Efficiëntie", p3_desc: "Digitale tools voor monteurs en magazijn. Verminder fouten en logistieke verliezen (Cores).", p4_title: "Strategische Intelligentie", p4_desc: "Real-time benchmarking en trendanalyse voor netwerken om de markt te leiden." },
            news: { title: "Marktintelligentie & Regelgeving", subtitle: "Blijf voor op Nederlandse wetten, EU-richtlijnen en tech trends.", read_more: "Lees Analyse", loading: "Laatste updates laden...", empty: "Geen nieuws beschikbaar op dit moment." },
            roadmap: { title: "Het Pad naar een Toekomstbestendig Bedrijf", subtitle: "Of u nu auto's repareert of een netwerk beheert, zo upgraden wij u.", step1: "Verbind & Scan", step1_desc: "Koppel uw DMS of inkoopdata. Wij scannen op verborgen kansen (Geld/Efficiëntie).", step2: "Analyseer & Benchmark", step2_desc: "AI vergelijkt uw prestaties met de markt. Identificeer gaten in ESG of Winst.", step3: "Optimaliseer & Voldoe", step3_desc: "Actiegerichte tools: Genereer ESG-rapporten, vraag subsidies aan of train personeel.", step4: "Groei & Rapporteer", step4_desc: "Toon uw 'Groene Score' aan klanten en banken. Ontgrendel betere financiering.", cta: "Start Uw Reis" },
            form: { title: "Sluit aan bij het Ecosysteem", subtitle: "Vraag een demo op maat voor uw specifieke rol in de aftermarket.", name: "Volledige naam", email: "Zakelijk E-mailadres", company: "Bedrijfsnaam / Organisatie", city: "Stad", role: "Uw Rol", role_placeholder: "Selecteer uw rol...", role_other: "Anders (specificeer a.u.b.)", custom_role_placeholder: "bijv. Beleidsmaker", newsletter: "Stuur mij de whitepaper 'Aftermarket 2030'.", submit: "Vraag Toegang", submitting: "Verwerken...", success: "Bedankt. U wordt doorgestuurd naar de tools..." },
            footer: { rights: "© 2026 Demandio Nederland. Empowering the Transition." }
        }
    };

    const opportunities: any = {
        garage_owner: [
            { id: 1, icon: <Euro className="w-8 h-8 text-yellow-500" />, title: { en: "Subsidy Radar", nl: "Subsidie Radar" }, pain: { en: "Collect money left on the table.", nl: "Geld van tafel rapen." }, desc: { en: "Scans monthly purchases for eligibility. Notification: 'You qualify for €2000 subsidy, click to claim'.", nl: "Scant maandelijkse aankopen. Melding: 'U komt in aanmerking voor €2000 subsidie, klik om te claimen'." }, tag: { en: "Cash-back", nl: "Cash-back" } },
            { id: 2, icon: <ShieldCheck className="w-8 h-8 text-green-500" />, title: { en: "Compliance Health", nl: "Compliance Gezondheid" }, pain: { en: "Fear of fines and shutdowns.", nl: "Angst voor boetes en sluiting." }, desc: { en: "Visual dashboard for permits, licenses (APK), and insurance status. Stop worrying about fines.", nl: "Visueel dashboard voor vergunningen, licenties (APK) en verzekeringen." }, tag: { en: "Risk Free", nl: "Risicovrij" } },
            { id: 3, icon: <FileBarChart className="w-8 h-8 text-blue-500" />, title: { en: "Auto-VSME Report", nl: "Auto-VSME Rapport" }, pain: { en: "Bank loan paperwork headaches.", nl: "Hoofdpijn van bankpapieren." }, desc: { en: "One-click PDF generation of energy and purchase data for banks or leasing companies.", nl: "Genereer met één klik een PDF van energie- en inkoopdata voor banken of leasemaatschappijen." }, tag: { en: "Credit", nl: "Krediet" } },
            { id: 4, icon: <PieChart className="w-8 h-8 text-purple-500" />, title: { en: "Real Profit Check", nl: "Winst Checker" }, pain: { en: "Guessing which repair makes money.", nl: "Gokken welke reparatie geld oplevert." }, desc: { en: "See net profit per bay or mechanic. Data-driven decisions to cut low-margin work.", nl: "Zie nettowinst per brug of monteur. Datagestuurde beslissingen om onrendabel werk te schrappen." }, tag: { en: "Insight", nl: "Inzicht" } }
        ],
        advisor: [
            { id: 5, icon: <Video className="w-8 h-8 text-blue-600" />, title: { en: "Visual Quote", nl: "Visuele Offerte" }, pain: { en: "Winning customer trust instantly.", nl: "Direct klantvertrouwen winnen." }, desc: { en: "Send a 15s mechanic video to WhatsApp with a price and 'Approve' button.", nl: "Stuur een 15s video naar WhatsApp met prijs en 'Akkoord' knop. Verhoog upsell." }, tag: { en: "Trust", nl: "Vertrouwen" } },
            { id: 6, icon: <Database className="w-8 h-8 text-indigo-600" />, title: { en: "ROB-Bot", nl: "ROB-Bot" }, pain: { en: "Lease portal complexity.", nl: "Complexiteit van leaseportalen." }, desc: { en: "Hides ROB-Net complexity. Tracks approval status in real-time.", nl: "Verbergt ROB-Net complexiteit. Volgt goedkeuringsstatus in realtime." }, tag: { en: "Time", nl: "Tijd" } },
            { id: 7, icon: <CheckCircle className="w-8 h-8 text-green-600" />, title: { en: "Customer Green Card", nl: "Klant Groene Kaart" }, pain: { en: "Customer loyalty retention.", nl: "Klantbehoud." }, desc: { en: "Beautiful report for the client: 'You saved 50kg CO2 by repairing'.", nl: "Mooi rapport voor de klant: 'U heeft 50kg CO2 bespaard'. Een krachtige marketingtool." }, tag: { en: "Marketing", nl: "Marketing" } },
            { id: 8, icon: <HelpCircle className="w-8 h-8 text-orange-500" />, title: { en: "QA Assist", nl: "Vraagbaak Assistent" }, pain: { en: "Explaining technical needs.", nl: "Technische noodzaak uitleggen." }, desc: { en: "Quick simplified technical data to explain why a part needs replacement.", nl: "Snelle vereenvoudigde technische data om uit te leggen waarom een onderdeel vervangen moet worden." }, tag: { en: "Professional", nl: "Professioneel" } }
        ],
        mechanic: [
            { id: 9, icon: <Mic className="w-8 h-8 text-red-500" />, title: { en: "Voice-to-Text Log", nl: "Spraak-Logboek" }, pain: { en: "Typing with greasy hands.", nl: "Typen met vette handen." }, desc: { en: "Record repair notes by voice. AI converts it to technical text.", nl: "Spreek reparatienotities in. AI zet het om naar technische tekst in het dossier." }, tag: { en: "Hands-free", nl: "Hands-free" } },
            { id: 10, icon: <QrCode className="w-8 h-8 text-blue-500" />, title: { en: "Just-in-Time Learning", nl: "Direct Leren" }, pain: { en: "Breaking expensive parts.", nl: "Dure onderdelen breken." }, desc: { en: "Scan QR on car/part to watch a 3-min specific install video.", nl: "Scan QR voor een specifieke 3-min installatievideo. Voorkom fouten." }, tag: { en: "Safety", nl: "Veiligheid" } },
            { id: 11, icon: <Smartphone className="w-8 h-8 text-purple-500" />, title: { en: "Remote Expert", nl: "Expert op Afstand" }, pain: { en: "Stuck on complex issues.", nl: "Vastlopen op complexe problemen." }, desc: { en: "Help button opens camera. Remote expert draws on screen to guide you.", nl: "Hulpknop opent camera. Expert tekent op scherm om u te begeleiden." }, tag: { en: "Support", nl: "Ondersteuning" } },
            { id: 12, icon: <ListChecks className="w-8 h-8 text-green-500" />, title: { en: "Smart Checklist", nl: "Slimme Checklist" }, pain: { en: "Forgetting steps during APK.", nl: "Stappen vergeten tijdens APK." }, desc: { en: "Digital checklist with large touch buttons. Faster work.", nl: "Digitale checklist met grote aanraakknoppen. Sneller werken, geen vergeten bouten." }, tag: { en: "Speed", nl: "Snelheid" } }
        ],
        warehouse: [
            { id: 13, icon: <RefreshCw className="w-8 h-8 text-red-600" />, title: { en: "Core Bounty Hunter", nl: "Statiegeld Jager" }, pain: { en: "Losing money on returns.", nl: "Geld verliezen op retouren." }, desc: { en: "Dashboard turns red: 'Return Part X by tomorrow or lose €50'.", nl: "Dashboard wordt rood: 'Stuur Onderdeel X morgen terug of verlies €50'. Stop inkomstenlekkage." }, tag: { en: "Profit", nl: "Winst" } },
            { id: 14, icon: <Barcode className="w-8 h-8 text-blue-600" />, title: { en: "Part Matcher", nl: "Onderdeel Matcher" }, pain: { en: "Wrong parts delivered.", nl: "Verkeerde onderdelen geleverd." }, desc: { en: "Scan barcode upon arrival. Instant beep if it doesn't match the order.", nl: "Scan barcode bij aankomst. Directe piep als het niet matcht. Verminder stiltstand." }, tag: { en: "Accuracy", nl: "Precisie" } },
            { id: 15, icon: <Grid className="w-8 h-8 text-orange-600" />, title: { en: "Tire Hotel Map", nl: "Bandenhotel Kaart" }, pain: { en: "Lost tires in warehouse.", nl: "Banden kwijt in magazijn." }, desc: { en: "Visual map showing exact location of customer tires + alerts.", nl: "Visuele kaart met exacte locatie van klantbanden + meldingen voor versleten banden." }, tag: { en: "Organized", nl: "Georganiseerd" } }
        ],
        financial: [
            { id: 16, icon: <RefreshCw className="w-8 h-8 text-blue-600" />, title: { en: "Auto-Sync", nl: "Auto-Sync" }, pain: { en: "Manual data entry hate.", nl: "Haat aan handmatige invoer." }, desc: { en: "Connects all operations (parts, hours) to SnelStart/Exact.", nl: "Verbindt alle operaties met SnelStart/Exact. Geen handmatige invoer meer." }, tag: { en: "Automation", nl: "Automatisering" } },
            { id: 17, icon: <Trash2 className="w-8 h-8 text-green-600" />, title: { en: "Digital Waste Log", nl: "Digitaal Afval Log" }, pain: { en: "Environmental audit stress.", nl: "Stress voor milieu-audit." }, desc: { en: "Digital archive of all disposal receipts. Always Audit Ready.", nl: "Digitaal archief van alle afvoerbewijzen. Altijd Audit Ready voor inspecteurs." }, tag: { en: "Compliance", nl: "Naleving" } },
            { id: 18, icon: <Receipt className="w-8 h-8 text-purple-600" />, title: { en: "Purchase Match", nl: "Inkoop Match" }, pain: { en: "Missing invoices.", nl: "Ontbrekende facturen." }, desc: { en: "Auto-match LKQ purchase invoices with parts used on customer cars.", nl: "Match automatisch LKQ-inkoopfacturen met gebruikte onderdelen. Nul lekkage." }, tag: { en: "Control", nl: "Controle" } }
        ],
        formula_manager: [
            { id: 19, icon: <Network className="w-8 h-8 text-indigo-600" />, title: { en: "Network Subsidy Engine", nl: "Netwerk Subsidie Motor" }, pain: { en: "Garage retention", nl: "Garage behoud" }, desc: { en: "Central dashboard showing '50 garages eligible for SLIM'. Bulk application tools.", nl: "Centraal dashboard toont '50 garages in aanmerking voor SLIM'. Bulk aanvraag tools." }, tag: { en: "Retention", nl: "Behoud" } },
            { id: 20, icon: <ShieldCheck className="w-8 h-8 text-teal-600" />, title: { en: "Brand Compliance", nl: "Merk Naleving" }, pain: { en: "Manual quality checks", nl: "Handmatige kwaliteitscontroles" }, desc: { en: "Auto-scoring of garages based on recycling and training data.", nl: "Auto-scoring van garages op basis van recycling en training data. Geen inspecteur nodig." }, tag: { en: "Quality", nl: "Kwaliteit" } },
            { id: 21, icon: <Building2 className="w-8 h-8 text-green-600" />, title: { en: "Green Marketing Hub", nl: "Groene Marketing Hub" }, pain: { en: "Brand differentiation", nl: "Merk differentiatie" }, desc: { en: "Aggregate circularity data for national TV campaigns.", nl: "Verzamel circulariteitsdata voor TV campagnes: 'Ons netwerk stoot 30% minder CO2 uit'." }, tag: { en: "Growth", nl: "Groei" } },
            { id: 22, icon: <FileBarChart className="w-8 h-8 text-purple-600" />, title: { en: "Performance Benchmark", nl: "Prestatie Benchmark" }, pain: { en: "Underperforming locations", nl: "Slecht presterende locaties" }, desc: { en: "Compare garage energy/waste data against network average to offer specific advice.", nl: "Vergelijk energie/afval data met netwerk gemiddelde voor specifiek advies." }, tag: { en: "Data", nl: "Data" } }
        ],
        association: [
            { id: 23, icon: <FileText className="w-8 h-8 text-indigo-600" />, title: { en: "Industry Pulse Report", nl: "Industrie Puls Rapport" }, pain: { en: "Lobbying power", nl: "Lobbykracht" }, desc: { en: "Real-time anonymous data from the market floor for negotiations.", nl: "Real-time anonieme data van de werkvloer voor onderhandelingen in Den Haag." }, tag: { en: "Lobby", nl: "Lobby" } },
            { id: 24, icon: <ListChecks className="w-8 h-8 text-blue-600" />, title: { en: "Self-Audit Tool", nl: "Zelf-Audit Tool" }, pain: { en: "Fine prevention", nl: "Boete preventie" }, desc: { en: "Digital checklists (ZE Zones, GDPR) branded for members to pre-check before inspections.", nl: "Digitale checklists (ZE Zones, AVG) voor leden om te checken voor inspectie." }, tag: { en: "Compliance", nl: "Naleving" } },
            { id: 25, icon: <TrendingUp className="w-8 h-8 text-purple-600" />, title: { en: "Tech Trend Watch", nl: "Tech Trend Watch" }, pain: { en: "Targeted training", nl: "Gerichte training" }, desc: { en: "Analyze common DTCs (errors) to identify exact training needs for the industry.", nl: "Analyseer veelvoorkomende foutcodes om trainingsbehoeften te identificeren." }, tag: { en: "Insight", nl: "Inzicht" } }
        ],
        wholesaler: [
            { id: 26, icon: <RefreshCw className="w-8 h-8 text-indigo-600" />, title: { en: "Smart Core Management", nl: "Slim Core Beheer" }, pain: { en: "Logistics losses", nl: "Logistieke verliezen" }, desc: { en: "API connection triggers reminder to garage: 'New part sold, return old core now'.", nl: "API-koppeling stuurt herinnering: 'Nieuw onderdeel verkocht, stuur oude retour'." }, tag: { en: "Logistics", nl: "Logistiek" } },
            { id: 27, icon: <Factory className="w-8 h-8 text-green-600" />, title: { en: "Scope 3 Collector", nl: "Scope 3 Verzamelaar" }, pain: { en: "CSRD Compliance", nl: "CSRD Naleving" }, desc: { en: "Automated collection of carbon footprint data from garage customers for your annual report.", nl: "Geautomatiseerde verzameling van CO2-data van klanten voor uw jaarverslag." }, tag: { en: "CSRD", nl: "CSRD" } },
            { id: 28, icon: <Award className="w-8 h-8 text-yellow-500" />, title: { en: "Green Parts Gamification", nl: "Groene Onderdelen Spel" }, pain: { en: "Selling reman parts", nl: "Verkoop reman onderdelen" }, desc: { en: "Points system: 'Buying this Reman alternator boosts your Green Score by 5 points'.", nl: "Puntensysteem: 'Koop deze Reman dynamo en verhoog uw Groene Score met 5'." }, tag: { en: "Sales", nl: "Verkoop" } }
        ]
    };

    const t = content[lang];

    const handleRoleSelect = (role: string) => {
        setActiveRole(role);
        setTimeout(() => { document.getElementById('solutions-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Hero Section */}
            <div className="pt-24 pb-12 md:pt-32 md:pb-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-900 opacity-20 transform -skew-x-12 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl mx-auto">
                    {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                    {t.hero.subtitle}
                </p>
                
                <div className="flex justify-center mb-16">
                    <button 
                    onClick={() => document.getElementById('roles')?.scrollIntoView({behavior: 'smooth'})}
                    className="bg-green-500 hover:bg-green-400 text-slate-900 text-lg font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center gap-3"
                    >
                    <Network className="w-5 h-5" />
                    {t.hero.cta}
                    </button>
                    <Link to="/tools" className="ml-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg font-bold py-4 px-8 rounded-full shadow-lg transition-all flex items-center gap-3">
                        <Package className="w-5 h-5" /> {t.nav.tools} 
                    </Link>
                </div>

                {/* Social Proof Badges & Stats */}
                <div className="border-t border-white/10 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-blue-200 text-sm font-semibold max-w-4xl mx-auto text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            {t.stats.stat1}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Network className="w-5 h-5 text-blue-400" />
                            {t.stats.stat2}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <BarChart3 className="w-5 h-5 text-yellow-400" />
                            {t.stats.stat3}
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Role Selection Section */}
            <div id="roles" className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t.roles.title}</h2>
                </div>
                
                {/* Operational Team Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-300 flex-grow"></div>
                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">{t.roles.section_operational}</h3>
                        <div className="h-px bg-gray-300 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <button onClick={() => handleRoleSelect('garage_owner')} className={`p-6 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'garage_owner' ? 'border-blue-600 text-blue-900 shadow-md scale-105 z-10 ring-2 ring-blue-100' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                            <Briefcase className={`w-10 h-10 mb-4 ${activeRole === 'garage_owner' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.garage_owner}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('advisor')} className={`p-6 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'advisor' ? 'border-blue-600 text-blue-900 shadow-md scale-105 z-10 ring-2 ring-blue-100' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                            <Car className={`w-10 h-10 mb-4 ${activeRole === 'advisor' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.advisor}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('mechanic')} className={`p-6 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'mechanic' ? 'border-blue-600 text-blue-900 shadow-md scale-105 z-10 ring-2 ring-blue-100' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                            <Wrench className={`w-10 h-10 mb-4 ${activeRole === 'mechanic' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.mechanic}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('warehouse')} className={`p-6 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'warehouse' ? 'border-blue-600 text-blue-900 shadow-md scale-105 z-10 ring-2 ring-blue-100' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                            <Package className={`w-10 h-10 mb-4 ${activeRole === 'warehouse' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.warehouse}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('financial')} className={`p-6 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'financial' ? 'border-blue-600 text-blue-900 shadow-md scale-105 z-10 ring-2 ring-blue-100' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                            <Euro className={`w-10 h-10 mb-4 ${activeRole === 'financial' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.financial}</h3>
                        </button>
                    </div>
                </div>

                {/* Strategic Partners Section */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-indigo-200 flex-grow"></div>
                        <h3 className="text-lg font-bold text-indigo-500 uppercase tracking-widest">{t.roles.section_strategic}</h3>
                        <div className="h-px bg-indigo-200 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <button onClick={() => handleRoleSelect('formula_manager')} className={`p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'formula_manager' ? 'border-indigo-600 text-indigo-900 shadow-md scale-105 z-10 ring-2 ring-indigo-100' : 'border-indigo-50 text-gray-600 hover:border-indigo-300'}`}>
                            <Network className={`w-12 h-12 mb-4 ${activeRole === 'formula_manager' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.formula_manager}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('association')} className={`p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'association' ? 'border-indigo-600 text-indigo-900 shadow-md scale-105 z-10 ring-2 ring-indigo-100' : 'border-indigo-50 text-gray-600 hover:border-indigo-300'}`}>
                            <Landmark className={`w-12 h-12 mb-4 ${activeRole === 'association' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.association}</h3>
                        </button>
                        <button onClick={() => handleRoleSelect('wholesaler')} className={`p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center hover:shadow-lg bg-white ${activeRole === 'wholesaler' ? 'border-indigo-600 text-indigo-900 shadow-md scale-105 z-10 ring-2 ring-indigo-100' : 'border-indigo-50 text-gray-600 hover:border-indigo-300'}`}>
                            <Factory className={`w-12 h-12 mb-4 ${activeRole === 'wholesaler' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            <h3 className="font-bold text-lg">{t.roles.wholesaler}</h3>
                        </button>
                    </div>
                </div>

                </div>
            </div>

            {/* Dynamic Solutions Section */}
            <div id="solutions-section" className={`transition-all duration-500 bg-white border-t border-gray-200 ${activeRole ? 'block' : 'hidden'}`}>
                {activeRole && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{t.solutions.title}: <span className="text-blue-600">{t.roles[activeRole]}</span></h2>
                        <button onClick={() => setActiveRole(null)} className="text-gray-500 hover:text-blue-600 text-sm mt-2 flex items-center font-medium">← {t.solutions.back}</button>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {opportunities[activeRole].map((opp: any) => (
                        <div key={opp.id} className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all p-8 flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">{opp.icon}</div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{opp.tag[lang]}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{opp.title[lang]}</h3>
                            <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                                <p className="text-xs text-red-800 font-bold uppercase mb-1">Pain Point</p>
                                <p className="text-sm text-red-900 italic">"{opp.pain[lang]}"</p>
                            </div>
                            <p className="text-gray-600 leading-relaxed flex-grow">{opp.desc[lang]}</p>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => navigate('/tools')} className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold hover:bg-blue-50 py-3 rounded-lg transition">
                                {lang === 'en' ? 'Open Tool' : 'Open Tool'} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>

            {/* Strategic Pillars (Why Demandio) */}
            <div id="pillars" className="py-20 bg-white border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.pillars.title}</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.pillars.subtitle}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6"><Euro className="w-8 h-8 text-green-600" /></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.pillars.p1_title}</h3>
                            <p className="text-gray-600 leading-relaxed">{t.pillars.p1_desc}</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6"><Leaf className="w-8 h-8 text-blue-600" /></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.pillars.p2_title}</h3>
                            <p className="text-gray-600 leading-relaxed">{t.pillars.p2_desc}</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6"><Settings className="w-8 h-8 text-purple-600" /></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.pillars.p3_title}</h3>
                            <p className="text-gray-600 leading-relaxed">{t.pillars.p3_desc}</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6"><TrendingUp className="w-8 h-8 text-indigo-600" /></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.pillars.p4_title}</h3>
                            <p className="text-gray-600 leading-relaxed">{t.pillars.p4_desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* News Section (Dynamic) */}
            <div id="news" className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.news.title}</h2>
                    <p className="text-gray-500">{t.news.subtitle}</p>
                </div>

                {loadingNews ? (
                    <div className="text-center py-10 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        <p className="text-gray-500">{t.news.loading}</p>
                    </div>
                ) : newsItems.length === 0 ? (
                     <div className="text-center py-10">
                        <p className="text-gray-500">{t.news.empty}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {newsItems.map((item, idx) => {
                            const linkUrl = item.slug 
                                ? `/article?slug=${item.slug}&lang=${lang}` 
                                : `/article?id=${item.id}&lang=${lang}`;

                            return (
                                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition flex flex-col h-full animate-fade-in">
                                    <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.source || 'Demandio'}</span>
                                    <span className="text-xs text-gray-400">{new Date(item.published_at || item.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{lang === 'en' ? item.title_en : item.title_nl}</h3>
                                    <p className="text-gray-600 text-sm flex-grow mb-4 line-clamp-3">{lang === 'en' ? item.desc_en : item.desc_nl}</p>
                                    <Link to={linkUrl} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline mt-auto">
                                    {t.news.read_more} <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="text-center mt-10">
                   <Link to="/news" className="text-blue-600 font-bold hover:underline">View All News &rarr;</Link>
                </div>
                </div>
            </div>

            {/* Subsidy Roadmap Section */}
            <div id="subsidyroadmap" className="py-24 bg-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t.roadmap.title}</h2>
                    <p className="text-xl text-blue-200">{t.roadmap.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition relative">
                        <div className="absolute -top-4 -left-4 bg-green-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue-900">1</div>
                        <LinkIcon className="w-8 h-8 text-blue-300 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t.roadmap.step1}</h3>
                        <p className="text-blue-200 text-sm">{t.roadmap.step1_desc}</p>
                    </div>
                    <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition relative">
                        <div className="absolute -top-4 -left-4 bg-green-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue-900">2</div>
                        <BarChart3 className="w-8 h-8 text-blue-300 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t.roadmap.step2}</h3>
                        <p className="text-blue-200 text-sm">{t.roadmap.step2_desc}</p>
                    </div>
                    <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition relative">
                        <div className="absolute -top-4 -left-4 bg-green-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue-900">3</div>
                        <Settings className="w-8 h-8 text-blue-300 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t.roadmap.step3}</h3>
                        <p className="text-blue-200 text-sm">{t.roadmap.step3_desc}</p>
                    </div>
                    <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition relative">
                        <div className="absolute -top-4 -left-4 bg-green-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue-900">4</div>
                        <TrendingUp className="w-8 h-8 text-blue-300 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t.roadmap.step4}</h3>
                        <p className="text-blue-200 text-sm">{t.roadmap.step4_desc}</p>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <button onClick={() => navigate('/tools')} className="bg-green-500 hover:bg-green-400 text-blue-900 font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 mx-auto">
                    <Network className="w-5 h-5" /> {t.roadmap.cta}
                    </button>
                </div>
                </div>
            </div>

            {/* Contact Form */}
            <div id="contact" className="bg-white py-20 border-t border-gray-200">
                <div className="max-w-xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                    {formStatus === 'success' ? (
                    <div className="text-center py-10 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-600">{t.form.success}</p>
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mt-4" />
                    </div>
                    ) : (
                    <form onSubmit={handleFormSubmit}>
                        <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">{t.form.title}</h2>
                        <p className="text-gray-500 mt-2">{t.form.subtitle}</p>
                        </div>
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.name}</label>
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                            <input type="text" required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" placeholder={lang==='en'?"John Doe":"Jan Jansen"} value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.email}</label>
                            <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" placeholder="naam@bedrijf.nl" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.company}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" placeholder={lang==='en'?"Garage Name":"Uw Bedrijf"} value={formData.company} onChange={(e)=>setFormData({...formData, company: e.target.value})} />
                            </div>
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.city}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" placeholder={lang==='en'?"Amsterdam":"Utrecht"} value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} />
                            </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.form.role}</label>
                            <select required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})}>
                                <option value="" disabled>{t.form.role_placeholder}</option>
                                <optgroup label={t.roles.section_operational}>
                                    <option value="owner">{t.roles.garage_owner}</option><option value="mechanic">{t.roles.mechanic}</option><option value="advisor">{t.roles.advisor}</option><option value="financial">{t.roles.financial}</option><option value="warehouse">{t.roles.warehouse}</option>
                                </optgroup>
                                <optgroup label={t.roles.section_strategic}>
                                    <option value="formula_manager">{t.roles.formula_manager}</option><option value="association">{t.roles.association}</option><option value="wholesaler">{t.roles.wholesaler}</option>
                                </optgroup>
                                <option value="other">{t.form.role_other}</option>
                            </select>
                        </div>
                        {formData.role === 'other' && (
                            <div className="animate-fade-in-down">
                            <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white" placeholder={t.form.custom_role_placeholder} value={formData.customRole} onChange={(e)=>setFormData({...formData, customRole: e.target.value})} />
                            </div>
                        )}
                        <div className="flex items-start gap-3 mt-4">
                            <div className="flex items-center h-5"><input id="newsletter" type="checkbox" className="focus:ring-blue-500 w-4 h-4 text-blue-600 border-gray-300 rounded" checked={formData.newsletter} onChange={(e)=>setFormData({...formData, newsletter: e.target.checked})} /></div>
                            <div className="text-sm"><label htmlFor="newsletter" className="font-medium text-gray-700">{t.form.newsletter}</label></div>
                        </div>
                        <button type="submit" disabled={formStatus==='submitting'} className={`w-full bg-blue-900 text-white font-bold text-lg py-4 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-lg mt-4 ${formStatus==='submitting'?'opacity-75 cursor-not-allowed':''}`}>
                            {formStatus==='submitting'?<><Loader2 className="w-5 h-5 animate-spin" /> {t.form.submitting}</>:<>{t.form.submit} <ArrowRight className="w-5 h-5" /></>}
                        </button>
                        </div>
                    </form>
                    )}
                </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Car className="text-white w-6 h-6" />
                                <span className="text-xl font-bold text-white">Demandio</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-xs mb-6">
                                {lang === 'en' ? "Empowering the Dutch aftermarket with data-driven sustainability and profitability tools." : "Versterking van de Nederlandse aftermarket met datagestuurde duurzaamheids- en winstgevendheidstools."}
                            </p>
                            <Link to="/privacy" className="flex items-center gap-2 bg-slate-800 w-fit px-3 py-1.5 rounded-full border border-slate-700 hover:bg-slate-700 transition cursor-pointer group">
                                <ShieldCheck className="w-4 h-4 text-green-500 group-hover:text-green-400" />
                                <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                                    {lang === 'en' ? "Hosted in EU • GDPR Compliant" : "Gehost in EU • AVG Proof"}
                                </span>
                            </Link>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">{lang === 'en' ? 'Contact Us' : 'Contactgegevens'}</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-blue-500 shrink-0" /><span>Fluwelen Burgwal 58<br/>2511CJ Den Haag<br/>The Netherlands</span></li>
                                <li className="flex items-center gap-3"><Send className="w-5 h-5 text-blue-500 shrink-0" /><a href="mailto:mikehasanzade@gmail.com" className="hover:text-white transition">mmikehasanzade@gmail.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Legal & Social</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.linkedin.com/company/demandio-cloud" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                                <li><Link to="/admin" className="hover:text-white transition">Admin Hub</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm">
                        <p>{t.footer.rights}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
