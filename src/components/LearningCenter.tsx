import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Search,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { quizQuestions } from '../data/spaceData.ts';

interface GlossaryTerm {
  term: string;
  termBn: string;
  category: string;
  def: string;
  defBn: string;
}

const glossaryData: GlossaryTerm[] = [
  {
    term: 'Accretion Disk',
    termBn: 'অ্যাক্রিশন ডিস্ক',
    category: 'Astrophysics',
    def: 'A flattened, rotating disk of matter orbiting a massive central body such as a black hole, protostar, or white dwarf, heated to millions of degrees by frictional shear stresses.',
    defBn: 'কৃষ্ণগহ্বর বা কোনো ভারী মহাজাগতিক বস্তুর চারপাশে ঘূর্ণায়মান গ্যাস ও প্লাজমার চাকতি, যা ঘর্ষণের ফলে লক্ষ লক্ষ ডিগ্রি তাপে উত্তপ্ত হয়ে এক্স-রে বিকিরণ করে।',
  },
  {
    term: 'Astronomical Unit (AU)',
    termBn: 'অ্যাস্ট্রোনমিক্যাল ইউনিট (AU)',
    category: 'Astronomy',
    def: 'The standardized mean distance from the center of the Earth to the center of the Sun, exactly defined as 149,597,870,700 meters (~149.6 million km).',
    defBn: 'পৃথিবীর কেন্দ্র থেকে সূর্যের গড় দূরত্ব, আন্তর্জাতিক মানে যা ঠিক ১৪৯,৫৯৭,৮৭০,৭০০ মিটার বা প্রায় ১৫ কোটি কিলোমিটার।',
  },
  {
    term: 'Cosmic Microwave Background (CMB)',
    termBn: 'মহাজাগতিক অণুতরঙ্গ পটভূমি বিকিরণ (CMB)',
    category: 'Cosmology',
    def: 'The thermal remnant radiation of the Big Bang filling all observable space, released ~380,000 years after creation during recombination when the universe cooled to 3,000 K (now redshifted to 2.725 K).',
    defBn: 'মহাবিস্ফোরণের প্রায় ৩.৮ লক্ষ বছর পর সৃষ্ট আদিম ফোটন কণার অবশিষ্ট তাপীয় বিকিরণ, যা বর্তমানে শীতল হয়ে ২.৭২৫ কেলভিন তাপমাত্রায় মহাবিশ্ব জুড়ে ছড়িয়ে আছে।',
  },
  {
    term: 'Dark Energy',
    termBn: 'ডার্ক এনার্জি (অদৃশ্য শক্তি)',
    category: 'Cosmology',
    def: 'A hypothetical form of energy exerting a negative gravitational pressure that accelerates the cosmic expansion of the universe, constituting roughly 68.3% of the total cosmic energy density.',
    defBn: 'মহাবিশ্বের স্থানকাল জুড়ে বিস্তৃত এক রহস্যময় শক্তি যা বিপরীতমুখী মহাকর্ষীয় চাপ সৃষ্টি করে স্থানকে প্রতিনিয়ত ত্বরান্বিত গতিতে প্রসারিত করছে।',
  },
  {
    term: 'Event Horizon',
    termBn: 'ইভেন্ট হরাইজন (ঘটনা দিগন্ত)',
    category: 'Astrophysics',
    def: 'The boundary around a black hole beyond which the gravitational pull is so extreme that the escape velocity exceeds the speed of light in vacuum, preventing any causal signal from escaping.',
    defBn: 'কৃষ্ণগহ্বরের এমন এক সীমানা যার ভেতরে মুক্তিবেগ আলোর গতির চেয়ে বেশি হওয়ায় কোনো সংকেত বা তথ্য বাইরে পৌঁছাতে পারে না।',
  },
  {
    term: 'Gravitational Lensing',
    termBn: 'মহাকর্ষীয় লেন্সিং',
    category: 'Relativity',
    def: 'The bending and amplification of light from a distant background source as it travels past a massive foreground object (such as a galaxy cluster), as predicted by Einstein’s General Relativity.',
    defBn: 'আইনস্টাইনের সাধারণ আপেক্ষিকতা অনুযায়ী কোনো ভারী গ্যালাক্সির পাশ দিয়ে যাওয়ার সময় দূরবর্তী বস্তুর আলোর গতিপথ বেঁকে গিয়ে বিবর্ধিত বা একাধিক প্রতিবিম্ব তৈরি হওয়া।',
  },
  {
    term: 'Habitable Zone (Goldilocks Zone)',
    termBn: 'বাসযোগ্য বলয় (হ্যাবিটেবল জোন)',
    category: 'Astrobiology',
    def: 'The orbital region around a host star where planetary surface temperatures allow liquid water to pool stably under sufficient atmospheric pressure.',
    defBn: 'একটি নক্ষত্রের চারপাশের নির্দিষ্ট দূরত্বের বলয় যেখানে কোনো গ্রহের পৃষ্ঠে তরল পানি টিকে থাকার মতো অনুকূল তাপমাত্রা বিরাজ করে।',
  },
  {
    term: 'Hubble-Lemaître Law',
    termBn: 'হাবল-ল্যামেত্রার সূত্র',
    category: 'Cosmology',
    def: 'The astrophysical observation that recessional velocity of distant galaxies is directly proportional to their distance from the observer: v = H0 * d.',
    defBn: 'দূরবর্তী গ্যালাক্সিগুলো আমাদের থেকে যে বেগে দূরে সরে যাচ্ছে, তা তাদের দূরত্বের সমানুপাতিক (v = H0 * d)।',
  },
];

export const LearningCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'glossary' | 'flashcards'>('quiz');
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Glossary State
  const [glossarySearch, setGlossarySearch] = useState('');

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const q = quizQuestions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === q.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  // Download Study Notes
  const handleDownloadStudyNotes = () => {
    let content = `# Galaxy Science AI - Astronomical Study Guide (2026)\n\n`;
    content += `Generated for scientific and astronomy education.\n\n`;
    content += `## 1. Key Astronomical Glossaries\n`;
    glossaryData.forEach((g) => {
      content += `### ${g.term} (${g.termBn})\n- **Category**: ${g.category}\n- **English**: ${g.def}\n- **বাংলা**: ${g.defBn}\n\n`;
    });
    content += `## 2. Fundamental Constants & Formulas\n`;
    content += `- Speed of Light (c): 299,792,458 m/s\n`;
    content += `- Gravitational Constant (G): 6.6743 × 10⁻¹¹ m³ kg⁻¹ s⁻²\n`;
    content += `- Astronomical Unit (AU): 149,597,870.7 km\n`;
    content += `- 1 Light-Year (ly): 9.461 × 10¹² km\n`;
    content += `- Schwarzschild Radius: rs = 2GM / c²\n`;
    content += `- Kepler's Third Law: T² = a³ / M\n`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Galaxy_Science_AI_Study_Guide.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredGlossary = glossaryData.filter((g) =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.termBn.includes(glossarySearch) ||
    g.category.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Science Learning Center</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              Bilingual Learning
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Interactive quizzes, astronomical flashcards, and scientific glossaries in English and Bengali.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('bn')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                lang === 'bn' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Download Study Notes */}
          <button
            onClick={handleDownloadStudyNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 transition-colors"
            title="Download complete astronomical study notes"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Download Notes</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2 text-xs bg-zinc-950">
        {[
          { id: 'quiz', label: lang === 'bn' ? 'কুইজ টেস্ট' : 'Astrophysics Quiz' },
          { id: 'flashcards', label: lang === 'bn' ? 'ফ্ল্যাশকার্ড' : 'Interactive Flashcards' },
          { id: 'glossary', label: lang === 'bn' ? 'মহাজাগতিক শব্দকোষ' : 'Scientific Glossary' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="p-5 sm:p-7 text-xs sm:text-sm text-zinc-300">
        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {!isQuizCompleted ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>
                    {lang === 'bn' ? 'প্রশ্ন' : 'Question'} {currentQuestionIndex + 1} of{' '}
                    {quizQuestions.length}
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {lang === 'bn' ? 'স্কোর' : 'Score'}: {score}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <h4 className="text-base font-bold text-white leading-relaxed">
                    {lang === 'bn' && q.questionBn ? q.questionBn : q.question}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {(lang === 'bn' && q.optionsBn ? q.optionsBn : q.options).map((opt, idx) => {
                    let btnStyle = 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800';
                    if (isAnswerSubmitted) {
                      if (idx === q.correctIndex) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                      } else if (idx === selectedAnswer) {
                        btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                      }
                    } else if (selectedAnswer === idx) {
                      btnStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && idx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerSubmitted && idx === selectedAnswer && idx !== q.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5 animate-in fade-in">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                      {lang === 'bn' ? 'বৈজ্ঞানিক ব্যাখ্যা' : 'Scientific Explanation'}:
                    </span>
                    <p className="text-zinc-300 leading-relaxed">
                      {lang === 'bn' && q.explanationBn ? q.explanationBn : q.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleConfirmAnswer}
                      disabled={selectedAnswer === null}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs transition-colors"
                    >
                      {lang === 'bn' ? 'উত্তর নিশ্চিত করুন' : 'Submit Answer'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors"
                    >
                      {currentQuestionIndex + 1 < quizQuestions.length
                        ? lang === 'bn'
                          ? 'পরবর্তী প্রশ্ন'
                          : 'Next Question'
                        : lang === 'bn'
                        ? 'ফলাফল দেখুন'
                        : 'View Results'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Completed View */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  {lang === 'bn' ? 'কুইজ সম্পন্ন হয়েছে!' : 'Cosmic Quiz Completed!'}
                </h4>
                <p className="text-zinc-400 text-sm">
                  {lang === 'bn'
                    ? `আপনার চূড়ান্ত স্কোর: ${quizQuestions.length} এর মধ্যে ${score}`
                    : `Your final score: ${score} out of ${quizQuestions.length}`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleRestartQuiz}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পুনরায় শুরু করুন' : 'Restart Quiz'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6 flex flex-col items-center">
            {(() => {
              const currentCard = glossaryData[cardIndex];
              return (
                <div className="w-full max-w-md space-y-4">
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative w-full h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none hover:border-cyan-500/40 transition-all shadow-xl"
                  >
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold absolute top-4 left-4">
                      {currentCard.category}
                    </span>
                    <span className="text-[10px] text-cyan-400 absolute top-4 right-4">
                      {lang === 'bn' ? 'ক্লিক করে উল্টান' : 'Click to flip'}
                    </span>

                    {!isFlipped ? (
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold text-white">{currentCard.term}</h4>
                        <p className="text-sm text-cyan-300 font-medium">{currentCard.termBn}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-in fade-in">
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                          {lang === 'bn' ? currentCard.defBn : currentCard.def}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setCardIndex((prev) => (prev > 0 ? prev - 1 : glossaryData.length - 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                    >
                      Previous
                    </button>
                    <span className="text-zinc-400">
                      {cardIndex + 1} / {glossaryData.length}
                    </span>
                    <button
                      onClick={() => {
                        setCardIndex((prev) => (prev + 1) % glossaryData.length);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GLOSSARY TAB */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800 max-w-md">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder={lang === 'bn' ? 'শব্দ খুঁজুন...' : 'Search astronomical terms...'}
                className="bg-transparent text-white placeholder-zinc-500 outline-none w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredGlossary.map((g, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm">{g.term}</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-400 font-mono">
                      {g.category}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-300 font-medium">{g.termBn}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {lang === 'bn' ? g.defBn : g.def}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
