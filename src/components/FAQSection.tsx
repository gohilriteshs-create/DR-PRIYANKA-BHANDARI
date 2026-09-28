import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

export const FAQSection: React.FC = () => {
  const { faqs } = useMedicalData();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleFAQ = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faqs" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Common Patient Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Find prompt answers regarding appointment booking, consultation preparation, clinic hours, and medical follow-up guidelines.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. follow-up, timings, reports)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-colors ${
                    isOpen
                      ? 'border-sky-300 bg-sky-50/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-xl"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-sky-100/60 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              No matching questions found. Please reach out to our clinic team directly.
            </div>
          )}
        </div>

        {/* Additional Help Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h4 className="text-sm font-bold text-slate-900">
            Have a question not addressed here?
          </h4>
          <p className="mt-1 text-xs text-slate-600">
            Our medical reception desk is available during clinic hours to answer queries regarding consultation procedures and appointments.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="#contact"
              className="text-xs font-semibold text-sky-800 hover:text-sky-950 underline underline-offset-2"
            >
              View Clinic Contact Info →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
