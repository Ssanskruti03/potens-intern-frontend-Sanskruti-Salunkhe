import React, { useState, useEffect, Fragment } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function StatusTracker({ onClose }) {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('reports');
    if (saved) {
      setReports(JSON.parse(saved).reverse());
    }
  }, []);

  const statusConfig = [
    { key: 'submitted', label: t('statusSubmitted'), icon: '📝' },
    { key: 'under-review', label: t('statusUnderReview'), icon: '🔍' },
    { key: 'in-progress', label: t('statusInProgress'), icon: '⚡' },
    { key: 'resolved', label: t('statusResolved'), icon: '✅' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-mobile w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2C2C2C]">
            {language === 'en' ? '📊 My Reports' : '📊 मेरी रिपोर्टें'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-[#6B6B6B]">
            <div className="text-4xl mb-3">📭</div>
            <p>{language === 'en' ? 'No reports yet' : 'अभी तक कोई रिपोर्ट नहीं'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const currentStatusIndex = statusConfig.findIndex(s => s.key === report.status);
              
              return (
                <div key={report.id} className="border border-secondary-dark/30 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <code className="text-sm font-mono font-bold text-primary">
                        {report.referenceId}
                      </code>
                      <p className="text-xs text-[#6B6B6B]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {statusConfig[currentStatusIndex]?.label || report.status}
                    </span>
                  </div>
                  
                  {/* Mini timeline for this report */}
                  <div className="mt-3 flex items-center gap-1">
                    {statusConfig.map((status, index) => {
                      const isActive = index <= currentStatusIndex;
                      return (
                        <Fragment key={status.key}>
                          <div className="flex flex-col items-center">
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs
                              ${isActive ? 'bg-primary text-white' : 'bg-secondary-dark/30 text-[#6B6B6B]'}
                            `}>
                              {isActive ? '✓' : index + 1}
                            </div>
                          </div>
                          {index < statusConfig.length - 1 && (
                            <div className={`
                              flex-1 h-0.5
                              ${isActive ? 'bg-primary' : 'bg-secondary-dark/30'}
                            `} />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                  
                  <div className="mt-2 text-xs text-[#6B6B6B] line-clamp-2">
                    {report.description || 'No description'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}