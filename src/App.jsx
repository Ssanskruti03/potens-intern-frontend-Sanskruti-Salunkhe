import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import StepIndicator from './components/StepIndicator';
import CategoryScreen from './components/CategoryScreen';
import DetailsScreen from './components/DetailsScreen';
import ConfirmationScreen from './components/ConfirmationScreen';

function AppContent() {
  const [step, setStep] = useState(1);
  const [report, setReport] = useState({
    category: null,
    description: '',
    photo: null,
    voiceNote: null,
  });
  const [submittedReport, setSubmittedReport] = useState(null);
  const { language, toggleLanguage, t } = useLanguage();

  // Load saved reports when app starts
  useEffect(() => {
    const saved = localStorage.getItem('reports');
    if (saved) {
      const reports = JSON.parse(saved);
      if (reports.length > 0) {
        setSubmittedReport(reports[reports.length - 1]);
      }
    }
  }, []);

  // Handle going to next step
  const handleNext = () => {
    if (step === 1 && !report.category) {
      alert(t('selectCategory'));
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  // Handle going back
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle submitting the report
  const handleSubmit = () => {
    const newReport = {
      id: Date.now(),
      ...report,
      referenceId: `CIV-${Date.now().toString(36).toUpperCase()}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const saved = localStorage.getItem('reports');
    const reports = saved ? JSON.parse(saved) : [];
    reports.push(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    setSubmittedReport(newReport);
    setStep(3);
  };

  // Reset for new report
  const resetReport = () => {
    setReport({ category: null, description: '', photo: null, voiceNote: null });
    setStep(1);
  };

  // Render the correct screen
  const renderScreen = () => {
    switch (step) {
      case 1:
        return (
          <CategoryScreen
            selected={report.category}
            onSelect={(cat) => setReport({ ...report, category: cat })}
          />
        );
      case 2:
        return (
          <DetailsScreen
            report={report}
            onUpdate={(data) => setReport({ ...report, ...data })}
          />
        );
      case 3:
        return (
          <ConfirmationScreen
            report={submittedReport}
            onNewReport={resetReport}
          />
        );
      default:
        return null;
    }
  };

  const showNav = step < 3;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="max-w-mobile w-full">
        {/* Language Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-secondary-dark/30 text-sm font-medium hover:bg-secondary-dark/20 transition-all"
            aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            <span className={language === 'en' ? 'text-primary font-bold' : 'text-[#6B6B6B]'}>
              EN
            </span>
            <span className="text-[#6B6B6B]">|</span>
            <span className={language === 'hi' ? 'text-primary font-bold' : 'text-[#6B6B6B]'}>
              हि
            </span>
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}

        {step < 4 && (
          <p className="text-sm text-[#6B6B6B] text-center mb-4">
            {t('stepProgress', { current: step, total: 3 })}
          </p>
        )}

        {/* Main Screen */}
        <div className="card p-6 animate-slide-up">
          {renderScreen()}
        </div>

        {/* Navigation Buttons */}
        {showNav && (
          <div className="flex gap-3 mt-4">
            {step > 1 && (
              <button onClick={handleBack} className="btn-secondary flex-1">
                {t('back')}
              </button>
            )}
            {step < 2 && (
              <button onClick={handleNext} className="btn-primary flex-1">
                {t('continue')}
              </button>
            )}
            {step === 2 && (
              <button onClick={handleSubmit} className="btn-primary flex-1">
                {t('submit')}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-[#6B6B6B]/50 text-center mt-4">
          PWA • Offline Ready
        </p>
      </div>
    </div>
  );
}

// Main App component
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;