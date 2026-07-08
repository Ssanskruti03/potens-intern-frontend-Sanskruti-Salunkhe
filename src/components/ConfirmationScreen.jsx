import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import StatusTracker from './StatusTracker';

export default function ConfirmationScreen({ report, onNewReport }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  if (!report) return <div>Loading...</div>;

  const copyReference = () => {
    navigator.clipboard.writeText(report.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statuses = ['submitted', 'under-review', 'in-progress', 'resolved'];
  const currentStatusIndex = statuses.indexOf(report.status);

  const getStatusLabel = (status) => {
    const statusMap = {
      'submitted': 'statusSubmitted',
      'under-review': 'statusUnderReview',
      'in-progress': 'statusInProgress',
      'resolved': 'statusResolved'
    };
    const key = statusMap[status] || 'statusSubmitted';
    return t(key);
  };

  return (
    <>
      <div>
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">✅</div>
          <h2 className="text-2xl font-bold text-primary">{t('confirmationTitle')}</h2>
        </div>

        <div className="bg-secondary-dark/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-[#6B6B6B] mb-1">{t('referenceId')}</p>
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono font-bold text-primary">
              {report.referenceId}
            </code>
            <button
              onClick={copyReference}
              className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
            >
              {copied ? t('copied') : t('copyId')}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-[#6B6B6B] mb-3">Status</p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary-dark/30" />
            {statuses.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div key={status} className="flex items-start gap-3 mb-4 last:mb-0 relative">
                  <div className={`
                    w-3 h-3 rounded-full mt-1.5 z-10 flex-shrink-0
                    ${isActive ? 'bg-primary' : 'bg-secondary-dark/30'}
                    ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                  `} />
                  <div>
                    <p className={`font-medium ${isActive ? 'text-[#2C2C2C]' : 'text-[#6B6B6B]'}`}>
                      {getStatusLabel(status)}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-[#6B6B6B]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowTracker(true)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <span>📊</span>
            {t('trackStatus')}
          </button>

          <button
            onClick={onNewReport}
            className="btn-primary w-full"
          >
            {t('newReport')}
          </button>
        </div>
      </div>

      {showTracker && (
        <StatusTracker onClose={() => setShowTracker(false)} />
      )}
    </>
  );
}