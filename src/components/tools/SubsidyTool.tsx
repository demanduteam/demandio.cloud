import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calculator, CheckCircle, X, AlertTriangle, Calendar, Zap, Truck, Home, GraduationCap, Euro, FileText, Send, HelpCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toolContent } from './ToolContent';

export default function SubsidyTool({ lang, setCurrentView }: { lang: string, setCurrentView: (view: string) => void }) {
    const tt = toolContent[lang].tool;
    const [subsidyStep, setSubsidyStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    const [subsidyData, setSubsidyData] = useState<any>({
        hasEH3: null, 
        recentPurchase: null, 
        categories: [], 
        invoiceValue: null, 
        isElectricVehicle: null, 
        isHeavyVehicle: null, 
        smallStaff: null 
    });
    const navigate = useNavigate();

    const handleCategoryToggle = (category: string) => {
        setSubsidyData((prev: any) => {
            const cats = prev.categories.includes(category) 
                ? prev.categories.filter((c: string) => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: cats };
        });
    };

    const nextFromStep3 = () => {
        if (subsidyData.categories.length === 0) return alert("Select at least one category.");
        setSubsidyStep(5);
    };

    const calculateSubsidies = () => {
        const results = [];
        if ((subsidyData.categories.includes('ev') && subsidyData.invoiceValue) || 
            (subsidyData.categories.includes('building'))) {
            results.push({ type: 'mia', title: tt.step5.card_mia, desc: tt.step5.card_mia_desc });
        }
        if (subsidyData.categories.includes('fleet') && subsidyData.isElectricVehicle && subsidyData.isHeavyVehicle) {
            results.push({ type: 'seba', title: tt.step5.card_seba, desc: tt.step5.card_seba_desc });
        }
        if (subsidyData.categories.includes('training') && subsidyData.smallStaff) {
            results.push({ type: 'slim', title: tt.step5.card_slim, desc: tt.step5.card_slim_desc });
        }
        if (results.length === 0 && subsidyData.categories.length > 0) {
            results.push({ type: 'mia', title: tt.step5.card_mia, desc: tt.step5.card_mia_desc });
        }
        return results;
    };

    const saveSubsidyToDB = async () => {
        setIsSaving(true);
        const results = calculateSubsidies();
        try {
            const { error } = await supabase
                .from('subsidy_checks')
                .insert([{ 
                    has_eh3: subsidyData.hasEH3,
                    recent_purchase: subsidyData.recentPurchase,
                    categories: subsidyData.categories,
                    invoice_value_gt_2500: subsidyData.invoiceValue,
                    is_electric_vehicle: subsidyData.isElectricVehicle,
                    is_heavy_vehicle: subsidyData.isHeavyVehicle,
                    small_staff: subsidyData.smallStaff,
                    potential_matches: results
                }]);

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving subsidy:', error);
            alert('Error saving data. See console for details.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-blue-900 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-6 h-6 text-green-400" />
                Demandio Subsidy Finder
                </h2>
                <div className="text-sm opacity-80 tracking-wide font-medium">Step {subsidyStep > 4 ? subsidyStep - 1 : subsidyStep} / 5</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2">
                <div className="bg-green-500 h-2 transition-all duration-500 ease-out" style={{ width: `${(subsidyStep > 4 ? (subsidyStep-1)/5 : subsidyStep/5)*100}%` }}></div>
            </div>

            <div className="p-4 md:p-8">
                <button onClick={() => setCurrentView('choice')} className="text-sm text-gray-500 mb-6 hover:text-gray-900 transition flex items-center gap-1 font-medium"><ArrowLeft className="w-4 h-4" /> Back to Hub</button>
                
                {/* STEP 1: Gatekeeper */}
                {subsidyStep === 1 && (
                <div className="animate-fade-in mt-4">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-center mb-4 text-gray-900">{tt.step1.title}</h3>
                    <p className="text-slate-500 text-center mb-8">{tt.step1.msg}</p>
                    
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 mb-8 max-w-lg mx-auto">
                    <p className="font-bold text-lg mb-6 text-slate-800 text-center">{tt.step1.q}</p>
                    <div className="space-y-3">
                        <button 
                        onClick={() => { setSubsidyData({...subsidyData, hasEH3: true}); setSubsidyStep(2); }}
                        className="w-full text-left px-6 py-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 font-semibold text-slate-700"
                        >
                        <div className="bg-green-50 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-500" /></div> {tt.step1.yes}
                        </button>
                        <button 
                        onClick={() => setSubsidyData({...subsidyData, hasEH3: false})}
                        className="w-full text-left px-6 py-4 bg-white border border-slate-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all flex items-center gap-3 font-semibold text-slate-700"
                        >
                        <div className="bg-red-50 p-2 rounded-lg"><X className="w-5 h-5 text-red-500" /></div> {tt.step1.no}
                        </button>
                    </div>
                    </div>

                    {subsidyData.hasEH3 === false && (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-4 flex gap-4 max-w-lg mx-auto animate-fade-in">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <div>
                        <p className="text-sm font-medium text-amber-800">{tt.step1.alert}</p>
                        <button onClick={() => setSubsidyStep(2)} className="text-blue-600 font-bold text-sm mt-3 hover:underline">
                            Continue Check &rarr;
                        </button>
                        </div>
                    </div>
                    )}
                </div>
                )}
                
                {subsidyStep === 2 && (
                <div className="animate-fade-in mt-4">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">{tt.step2.title}</h3>
                    <p className="text-gray-600 text-center mb-8">{tt.step2.msg}</p>

                    <div className="space-y-4 max-w-lg mx-auto">
                        <p className="font-bold text-lg mb-2 text-gray-900">{tt.step2.q}</p>
                        <button 
                        onClick={() => { setSubsidyData({...subsidyData, recentPurchase: true}); setSubsidyStep(3); }}
                        className="w-full text-left px-6 py-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-medium"
                        >
                        {tt.step2.yes}
                        </button>
                        <button 
                        onClick={() => { setSubsidyData({...subsidyData, recentPurchase: false}); setSubsidyStep(3); }}
                        className="w-full text-left px-6 py-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-medium"
                        >
                        {tt.step2.no}
                        </button>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                    <button onClick={() => setSubsidyStep(1)} className="text-gray-400 hover:text-gray-600">{tt.back}</button>
                    </div>
                </div>
                )}

                {subsidyStep === 3 && (
                <div className="animate-fade-in mt-4">
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">{tt.step3.title}</h3>
                    <p className="text-gray-600 text-center mb-8">{tt.step3.msg}</p>

                    <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('ev') ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>
                        <div onClick={() => handleCategoryToggle('ev')} className="cursor-pointer p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('ev') ? 'bg-blue-200' : 'bg-gray-100'}`}><Zap className="w-6 h-6 text-gray-700" /></div>
                        <span className="font-semibold text-lg">{tt.step3.opt_ev}</span>
                        {subsidyData.categories.includes('ev') && <CheckCircle className="ml-auto w-6 h-6 text-blue-600" />}
                        </div>
                        {subsidyData.categories.includes('ev') && (
                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm mt-2 ml-4 md:ml-12">
                                <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_ev}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setSubsidyData({...subsidyData, invoiceValue: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.invoiceValue === true ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                    <button onClick={() => setSubsidyData({...subsidyData, invoiceValue: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.invoiceValue === false ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('fleet') ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300'}`}>
                        <div onClick={() => handleCategoryToggle('fleet')} className="cursor-pointer p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('fleet') ? 'bg-orange-200' : 'bg-gray-100'}`}><Truck className="w-6 h-6 text-gray-700" /></div>
                        <span className="font-semibold text-lg">{tt.step3.opt_fleet}</span>
                        {subsidyData.categories.includes('fleet') && <CheckCircle className="ml-auto w-6 h-6 text-orange-600" />}
                        </div>
                        {subsidyData.categories.includes('fleet') && (
                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                            <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm mt-2 ml-4 md:ml-12 space-y-4">
                                <div><p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_fleet_electric}</p><div className="flex gap-2"><button onClick={() => setSubsidyData({...subsidyData, isElectricVehicle: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isElectricVehicle === true ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button><button onClick={() => setSubsidyData({...subsidyData, isElectricVehicle: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isElectricVehicle === false ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button></div></div>
                                <div><p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_fleet_weight}</p><div className="flex gap-2"><button onClick={() => setSubsidyData({...subsidyData, isHeavyVehicle: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isHeavyVehicle === true ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button><button onClick={() => setSubsidyData({...subsidyData, isHeavyVehicle: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isHeavyVehicle === false ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button></div></div>
                            </div>
                        </div>
                        )}
                    </div>

                    <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('building') ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-green-300'}`}>
                        <div onClick={() => handleCategoryToggle('building')} className="cursor-pointer p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('building') ? 'bg-green-200' : 'bg-gray-100'}`}><Home className="w-6 h-6 text-gray-700" /></div>
                        <span className="font-semibold text-lg">{tt.step3.opt_building}</span>
                        {subsidyData.categories.includes('building') && <CheckCircle className="ml-auto w-6 h-6 text-green-600" />}
                        </div>
                    </div>

                    <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('training') ? 'border-purple-500 bg-purple-50/50' : 'border-gray-200 hover:border-purple-300'}`}>
                        <div onClick={() => handleCategoryToggle('training')} className="cursor-pointer p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('training') ? 'bg-purple-200' : 'bg-gray-100'}`}><GraduationCap className="w-6 h-6 text-gray-700" /></div>
                        <span className="font-semibold text-lg">{tt.step3.opt_training}</span>
                        {subsidyData.categories.includes('training') && <CheckCircle className="ml-auto w-6 h-6 text-purple-600" />}
                        </div>
                        {subsidyData.categories.includes('training') && (
                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                            <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm mt-2 ml-4 md:ml-12">
                                <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_training}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setSubsidyData({...subsidyData, smallStaff: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.smallStaff === true ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                    <button onClick={() => setSubsidyData({...subsidyData, smallStaff: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.smallStaff === false ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                    <button onClick={() => setSubsidyStep(2)} className="text-gray-400 hover:text-gray-600">{tt.back}</button>
                    <button onClick={nextFromStep3} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg">{tt.next} &rarr;</button>
                    </div>
                </div>
                )}

                {subsidyStep === 5 && (
                <div className="animate-fade-in mt-4">
                     <div className="text-center mb-10">
                       <h3 className="text-3xl font-extrabold text-gray-900 mb-3">{tt.step5.title}</h3>
                       <p className="text-slate-500">{tt.step5.msg}</p>
                     </div>

                     <div className="grid gap-4 mb-10">
                        {calculateSubsidies().map((item: any, index: number) => (
                          <div key={index} className="bg-white border text-left border-green-500 p-6 rounded-2xl shadow-md relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-bl-xl tracking-widest">ELIGIBLE</div>
                            <h4 className="text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                              <CheckCircle className="text-green-500 w-5 h-5" /> {item.title}
                            </h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        ))}
                        
                        {calculateSubsidies().length === 0 && (
                          <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 font-medium text-slate-500">
                            <p>Based on inputs, no specific standard subsidies match, but contact us for a custom check.</p>
                          </div>
                        )}
                     </div>

                     <button 
                        onClick={() => setSubsidyStep(6)}
                        className="w-full bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg text-lg transform hover:-translate-y-0.5"
                      >
                        Claim Opportunities &rarr;
                      </button>
                </div>
                )}

                 {subsidyStep === 6 && (
                  <div className="animate-fade-in text-center mt-4">
                     <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Euro className="w-12 h-12 text-green-500" />
                     </div>
                     <h3 className="text-3xl font-extrabold text-gray-900 mb-3">{tt.step6.title}</h3>
                     <p className="text-slate-500 mb-10 text-lg">{tt.step6.msg}</p>

                     {saveStatus === 'success' && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 font-bold border border-green-100 flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> {tt.saved}
                        </div>
                     )}

                     <div className="grid gap-4 max-w-sm mx-auto">
                       <button className="flex items-center justify-center gap-3 bg-blue-900 text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-md w-full">
                          <FileText className="w-5 h-5" /> {tt.step6.btn_esg}
                       </button>
                       <button 
                          onClick={saveSubsidyToDB}
                          disabled={isSaving || saveStatus === 'success'}
                          className="flex items-center justify-center gap-3 bg-white text-blue-900 border-2 border-blue-900 p-4 rounded-xl font-bold hover:bg-blue-50 transition w-full"
                       >
                          {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <Send className="w-5 h-5" />} 
                          {isSaving ? tt.saving : tt.step6.btn_acc}
                       </button>
                       <button className="flex items-center justify-center gap-3 bg-slate-100 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-200 transition w-full">
                          <HelpCircle className="w-5 h-5" /> {tt.step6.btn_consult}
                       </button>
                     </div>
                     
                     <div className="mt-12 pt-8 border-t border-slate-100">
                        <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-400 hover:text-slate-600 transition">Back to Home</button>
                     </div>
                  </div>
                )}

            </div>
            </div>
        </div>
    );
}
