import React from 'react';

export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`step-dot ${
            step < currentStep
              ? 'step-dot-completed'
              : step === currentStep
              ? 'step-dot-active'
              : 'step-dot-inactive'
          }`}
          aria-label={`Step ${step}`}
        />
      ))}
    </div>
  );
}