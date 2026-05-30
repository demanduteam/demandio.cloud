import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileBarChart, CheckCircle, Loader2, Save, ArrowLeft } from 'lucide-react';
import { toolContent } from './ToolContent';

export default function VSMETool({ lang, setCurrentView }: { lang: string, setCurrentView: (view: string) => void }) {
    const tt = toolContent[lang].tool;
    const [vsmeView, setVsmeView] = useState('setup');
    const [vsmeStepIndex, setVsmeStepIndex] = useState(0); 
    const [vsmeStepsList, setVsmeStepsList] = useState<string[]>([]);
    const [vsmeConfig, setVsmeConfig] = useState({ listed: false, bpModule: false, comprehensive: false });
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    const [vsmeData, setVsmeData] = useState({
        isListed: 'no',
        reportPurpose: 'basic',
        hasPolicies: 'no',
        b1_name: '', b1_basis: 'Individual basis', b1_legal_form: '', b1_nace: '', b1_country: '', b1_turnover: '', b1_employees: '',
        b2_practices: '',
        b3_energy_total: '', b3_energy_ren: '', b3_energy_nonren: '', b3_scope1: '', b3_scope2: '',
        b4_pollution: '', b5_sensitive: '', b6_water: '', b7_waste_haz: '', b7_waste_recycled: '',
        b8_perm: '', b8_temp: '', b8_female: '', b9_accidents: '', b10_minwage: 'Yes',
        b11_convictions: '', b11_fines: '',
        bp_code: 'No', bp_grievance: 'No', bp_payment: '', bp_excluded_rev: '', bp_scope3_status: 'Not Measured', bp_climate_risks: '',
        c1_strategy: '', c2_policies: '', c3_targets: '', c4_risks: '', c5_mgmt_gender: '', c6_policy: 'No', c7_incidents: 'None', c8_revenue: '', c9_board_gender: ''
    });

    const handleVsmeChange = (field: string, value: any) => {
        setVsmeData(prev => ({ ...prev, [field]: value }));
    };

    const startVsmeApp = () => {
        if (vsmeData.isListed === 'yes') {
            alert("Since you are listed, this VSME tool is not sufficient. Please use ESRS LSME standards.");
            return;
        }
        
        const isBP = vsmeData.reportPurpose === 'partner';
        const isComp = vsmeData.hasPolicies === 'yes';
        setVsmeConfig({ listed: false, bpModule: isBP, comprehensive: isComp });

        const steps = ['gen', 'env', 'soc', 'gov'];
        if (isBP) steps.push('bp');
        if (isComp) steps.push('c1');
        steps.push('generate');
        
        setVsmeStepsList(steps);
        setVsmeView('wizard');
        setVsmeStepIndex(0);
        window.scrollTo(0, 0);
    };

    const fillFakeVsmeData = () => {
        setVsmeData(prev => ({
            ...prev,
            b1_name: "AutoParts NL B.V.", b1_basis: "Individual basis", b1_legal_form: "B.V.", b1_nace: "45.31", b1_country: "Netherlands", b1_turnover: "12500000", b1_employees: "45",
            b2_practices: "Installation of LED lighting and consolidation of shipments to reduce CO2 per delivery.",
            b3_energy_total: "480", b3_energy_ren: "480", b3_energy_nonren: "0", b3_scope1: "48.5", b3_scope2: "0",
            b4_pollution: "None", b5_sensitive: "0", b6_water: "450", b7_waste_haz: "0.2", b7_waste_recycled: "12",
            b8_perm: "35", b8_temp: "10", b8_female: "16", b9_accidents: "1", b10_minwage: "Yes",
            b11_convictions: "0", b11_fines: "0",
            bp_code: "Yes", bp_grievance: "Yes", bp_payment: "30 days", bp_excluded_rev: "0%", bp_scope3_status: "Estimated", bp_climate_risks: "Physical risk: Heat (Low).",
            c1_strategy: "Focus on EV parts.", c2_policies: "HSE committee reports to Board.", c3_targets: "Scope 1 -50% by 2030.", c4_risks: "Flooding risk (Low).",
            c5_mgmt_gender: "40% Female", c6_policy: "Yes", c7_incidents: "None", c8_revenue: "0%", c9_board_gender: "25% Female"
        }));
    };

    const saveVSMEReportToDB = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('vsme_reports')
                .insert([{ company_name: vsmeData.b1_name || 'Unnamed Company', report_data: vsmeData }]);

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving report:', error);
            alert('Error saving report. Check console.');
        } finally {
            setIsSaving(false);
        }
    };

    if (vsmeView === 'report') {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
                <div className="max-w-4xl mx-auto bg-white p-4 md:p-10 shadow-2xl rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
                        <h1 className="text-2xl font-bold text-blue-900">VSME Report <span className="text-sm font-normal text-gray-500">({vsmeConfig.comprehensive ? 'Comprehensive' : 'Basic'})</span></h1>
                        <div className="flex gap-2 print:hidden flex-wrap">
                            <button 
                                onClick={saveVSMEReportToDB} 
                                disabled={isSaving || saveStatus === 'success'}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-white transition ${saveStatus === 'success' ? 'bg-green-600' : 'bg-blue-900 hover:bg-blue-800'}`}
                            >
                                {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
                                {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save to Cloud'}
                            </button>
                            <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">PDF</button>
                            <button onClick={() => setVsmeView('setup')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition text-gray-800">New</button>
                            <button onClick={() => setCurrentView('choice')} className="bg-white border text-gray-600 px-4 py-2 rounded hover:bg-gray-50 transition">Exit</button>
                        </div>
                    </div>
                    {saveStatus === 'success' && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-bold animate-fade-in">{tt.saved}</div>}

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-2">General & Strategy</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div><strong>Company:</strong> {vsmeData.b1_name}</div>
                                <div><strong>Basis:</strong> {vsmeData.b1_basis}</div>
                                <div><strong>Turnover:</strong> €{vsmeData.b1_turnover}</div>
                                <div><strong>Employees:</strong> {vsmeData.b1_employees}</div>
                                <div className="col-span-1 sm:col-span-2 mt-2"><strong>Transition Practices:</strong><p className="bg-gray-50 p-2 rounded mt-1">{vsmeData.b2_practices}</p></div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-2">Environment</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div><strong>Energy Total:</strong> {vsmeData.b3_energy_total} MWh</div>
                                <div><strong>Renewable:</strong> {vsmeData.b3_energy_ren} MWh</div>
                                <div><strong>Scope 1:</strong> {vsmeData.b3_scope1} tCO2e</div>
                                <div><strong>Water:</strong> {vsmeData.b6_water} m3</div>
                                <div><strong>Haz. Waste:</strong> {vsmeData.b7_waste_haz} T</div>
                                <div><strong>Recycled:</strong> {vsmeData.b7_waste_recycled} T</div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-2">Social & Governance</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div><strong>Perm. Staff:</strong> {vsmeData.b8_perm}</div>
                                <div><strong>Accidents:</strong> {vsmeData.b9_accidents}</div>
                                <div><strong>Min Wage:</strong> {vsmeData.b10_minwage}</div>
                                <div><strong>Convictions:</strong> {vsmeData.b11_convictions}</div>
                            </div>
                        </section>
                        {vsmeConfig.bpModule && (
                            <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                                <h2 className="text-lg font-bold text-indigo-900 border-b border-indigo-200 mb-4 pb-2">Business Partner Module</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div><strong>Supplier Code:</strong> {vsmeData.bp_code}</div>
                                    <div><strong>Grievance Mech:</strong> {vsmeData.bp_grievance}</div>
                                    <div><strong>Excluded Rev:</strong> {vsmeData.bp_excluded_rev}</div>
                                    <div><strong>Scope 3 Status:</strong> {vsmeData.bp_scope3_status}</div>
                                    <div className="col-span-1 sm:col-span-2"><strong>Climate Risks:</strong> {vsmeData.bp_climate_risks}</div>
                                </div>
                            </section>
                        )}
                        {vsmeConfig.comprehensive && (
                            <section className="bg-teal-50 p-6 rounded-lg border border-teal-100">
                                <h2 className="text-lg font-bold text-teal-900 border-b border-teal-200 mb-4 pb-2">Comprehensive Strategy</h2>
                                <div className="space-y-3 text-sm">
                                    <div><strong>Strategy:</strong> {vsmeData.c1_strategy}</div>
                                    <div><strong>Targets:</strong> {vsmeData.c3_targets}</div>
                                    <div><strong>Mgmt Gender:</strong> {vsmeData.c5_mgmt_gender}</div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (vsmeView === 'wizard') {
        const step = vsmeStepsList[vsmeStepIndex];
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-blue-900 px-6 py-4 flex justify-between items-center text-white">
                        <h2 className="font-bold flex items-center gap-2"><FileBarChart /> VSME Generator</h2>
                        <span className="text-sm opacity-80">Step {vsmeStepIndex + 1}/{vsmeStepsList.length}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-1.5">
                        <div className="bg-blue-500 h-1.5 transition-all duration-300" style={{ width: `${((vsmeStepIndex + 1) / vsmeStepsList.length) * 100}%` }}></div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="flex justify-end mb-4">
                             <button onClick={fillFakeVsmeData} type="button" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-bold transition">🪄 Auto Fill Demo Data</button>
                        </div>

                        <div className="space-y-6">
                            {step === 'gen' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold mb-4">General Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Legal Name" value={vsmeData.b1_name} onChange={(e)=>handleVsmeChange('b1_name', e.target.value)} />
                                        <input className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Legal Form" value={vsmeData.b1_legal_form} onChange={(e)=>handleVsmeChange('b1_legal_form', e.target.value)} />
                                        <input className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Turnover (€)" value={vsmeData.b1_turnover} onChange={(e)=>handleVsmeChange('b1_turnover', e.target.value)} />
                                        <input className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Employees" value={vsmeData.b1_employees} onChange={(e)=>handleVsmeChange('b1_employees', e.target.value)} />
                                        <textarea className="col-span-1 md:col-span-2 border border-slate-200 p-2 rounded h-24 outline-none focus:border-blue-500" placeholder="Transition Practices (e.g. LED lights)" value={vsmeData.b2_practices} onChange={(e)=>handleVsmeChange('b2_practices', e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {step === 'env' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold mb-4">Environment (B3-B7)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Total Energy (MWh)" value={vsmeData.b3_energy_total} onChange={(e)=>handleVsmeChange('b3_energy_total', e.target.value)} />
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Scope 1 (tCO2e)" value={vsmeData.b3_scope1} onChange={(e)=>handleVsmeChange('b3_scope1', e.target.value)} />
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Water (m3)" value={vsmeData.b6_water} onChange={(e)=>handleVsmeChange('b6_water', e.target.value)} />
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Haz. Waste (T)" value={vsmeData.b7_waste_haz} onChange={(e)=>handleVsmeChange('b7_waste_haz', e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {step === 'soc' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold mb-4">Social (B8-B10)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Perm. Employees" value={vsmeData.b8_perm} onChange={(e)=>handleVsmeChange('b8_perm', e.target.value)} />
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Accidents" value={vsmeData.b9_accidents} onChange={(e)=>handleVsmeChange('b9_accidents', e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {step === 'gov' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold mb-4">Governance (B11)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="number" className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Convictions" value={vsmeData.b11_convictions} onChange={(e)=>handleVsmeChange('b11_convictions', e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {step === 'bp' && (
                                <div className="animate-fade-in bg-indigo-50 p-4 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4 text-indigo-900">Business Partners Module</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <select className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" value={vsmeData.bp_code} onChange={(e)=>handleVsmeChange('bp_code', e.target.value)}>
                                            <option value="Yes">Supplier Code: Yes</option><option value="No">Supplier Code: No</option>
                                        </select>
                                        <input className="border border-slate-200 p-2 rounded outline-none focus:border-blue-500" placeholder="Excluded Revenue (%)" value={vsmeData.bp_excluded_rev} onChange={(e)=>handleVsmeChange('bp_excluded_rev', e.target.value)} />
                                        <textarea className="border border-slate-200 p-2 rounded h-20 outline-none focus:border-blue-500" placeholder="Climate Risks" value={vsmeData.bp_climate_risks} onChange={(e)=>handleVsmeChange('bp_climate_risks', e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {step === 'c1' && (
                                <div className="animate-fade-in bg-teal-50 p-4 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4 text-teal-900">Comprehensive Strategy</h3>
                                    <textarea className="w-full border border-slate-200 p-2 rounded h-32 mb-4 outline-none focus:border-blue-500" placeholder="Business Strategy" value={vsmeData.c1_strategy} onChange={(e)=>handleVsmeChange('c1_strategy', e.target.value)} />
                                    <textarea className="w-full border border-slate-200 p-2 rounded h-32 outline-none focus:border-blue-500" placeholder="GHG Targets" value={vsmeData.c3_targets} onChange={(e)=>handleVsmeChange('c3_targets', e.target.value)} />
                                </div>
                            )}
                            {step === 'generate' && (
                                <div className="text-center py-10 animate-fade-in">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Ready to Generate</h3>
                                    <p className="text-gray-600 mb-8">All required data has been collected.</p>
                                    <button onClick={() => setVsmeView('report')} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition transform hover:-translate-y-0.5">
                                        Generate Report
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Nav Buttons */}
                        {step !== 'generate' && (
                            <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
                                <button onClick={() => {
                                    if(vsmeStepIndex > 0) setVsmeStepIndex(vsmeStepIndex - 1);
                                    else setVsmeView('setup');
                                }} className="text-gray-500 font-semibold hover:text-gray-800 transition py-2 px-4 border rounded hover:bg-slate-50">Back</button>
                                <button onClick={() => setVsmeStepIndex(vsmeStepIndex + 1)} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-sm">
                                    Next Step
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-6 md:p-8 border-t-4 border-blue-600">
                <div className="mb-8">
                    <button onClick={() => setCurrentView('choice')} className="text-sm text-gray-500 mb-4 hover:text-gray-800 transition flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Back to Hub</button>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">VSME Wizard Setup</h1>
                    <p className="text-gray-600">Determine required reporting modules.</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <label className="block font-bold mb-3 text-slate-800">1. Are you listed on an EU market?</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="radio" name="isListed" value="yes" checked={vsmeData.isListed === 'yes'} onChange={(e)=>handleVsmeChange('isListed', e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> Yes</label>
                            <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="radio" name="isListed" value="no" checked={vsmeData.isListed === 'no'} onChange={(e)=>handleVsmeChange('isListed', e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> No</label>
                        </div>
                        {vsmeData.isListed === 'yes' && <p className="text-red-500 text-sm mt-3 font-bold bg-red-50 p-2 rounded inline-block">⛔ Stop: You require full ESRS LSME.</p>}
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <label className="block font-bold mb-3 text-slate-800">2. Report Purpose?</label>
                        <select className="w-full border p-3 rounded-lg bg-white outline-none focus:border-blue-500 text-slate-700" value={vsmeData.reportPurpose} onChange={(e)=>handleVsmeChange('reportPurpose', e.target.value)}>
                            <option value="basic">Internal Transparency (Basic)</option>
                            <option value="partner">Bank / Partner Request (Basic + BP)</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <label className="block font-bold mb-3 text-slate-800">3. Formal Policies & Targets?</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="radio" name="hasPolicies" value="no" checked={vsmeData.hasPolicies === 'no'} onChange={(e)=>handleVsmeChange('hasPolicies', e.target.value)} className="w-4 h-4 text-blue-600 outline-none focus:ring-blue-500 border-gray-300" /> No (Basic)</label>
                            <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="radio" name="hasPolicies" value="yes" checked={vsmeData.hasPolicies === 'yes'} onChange={(e)=>handleVsmeChange('hasPolicies', e.target.value)} className="w-4 h-4 text-blue-600 outline-none focus:ring-blue-500 border-gray-300" /> Yes (Comprehensive)</label>
                        </div>
                    </div>

                    <button 
                        onClick={startVsmeApp} 
                        disabled={vsmeData.isListed === 'yes'}
                        className={`w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 mt-4 ${vsmeData.isListed === 'yes' ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                    >
                        Start Assessment
                    </button>
                </div>
            </div>
        </div>
    );
}
