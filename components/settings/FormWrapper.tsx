'use client';

import React, { useRef, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Loader2, Save } from 'lucide-react';
import { SettingsFormState } from '@/actions/settings';

interface FormWrapperProps {
  action: (prevState: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
  initialState: SettingsFormState;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ action, initialState, title, description, children }) => {
  const [state, formAction] = useFormState(action, initialState);
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 border-b pb-4">{description}</p>
      
      {/* Status Message Display */}
      {state.message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          state.success ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {state.message}
        </div>
      )}

      <form action={handleAction} className="space-y-6">
        {children}

        <button
          type="submit"
          disabled={isPending}
          className={`
            w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center
            ${isPending 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700'
            }
          `}
        >
          {isPending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</> : <><Save className="w-5 h-5 mr-2" /> Save Settings</>}
        </button>
      </form>
    </div>
  );
};
