import React from 'react';
import { FormWrapper } from './FormWrapper';
import { NotificationSettings } from '@/lib/mockData/settings';
import { updateNotificationSettings } from "@/actions/settings/updateNotificationSettings";

interface NotificationSectionProps {
  settings: NotificationSettings;
}

const NotificationToggle: React.FC<{ id: string, label: string, defaultChecked: boolean, description: string }> = ({ id, label, defaultChecked, description }) => (
    <div className="flex items-start space-x-4 border border-gray-100 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center h-5">
            <input id={id} name={id} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
        </div>
        <div className="flex-1 min-w-0">
            <label htmlFor={id} className="font-medium text-gray-900 block">{label}</label>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
    </div>
);


export const NotificationSection: React.FC<NotificationSectionProps> = ({ settings }) => {
  const initialState = { success: false, message: '' };

  return (
    <FormWrapper
      action={updateNotificationSettings}
      initialState={initialState}
      title="Notification Preferences"
      description="Control how you receive alerts about bids, payouts, and platform updates."
    >
        <div className="space-y-3">
            <NotificationToggle id="bidAlerts" label="New Bid Alerts" defaultChecked={settings.bidAlerts} description="Receive alerts when a new bid is placed on your auctions." />
            <NotificationToggle id="payoutAlerts" label="Payout Status Updates" defaultChecked={settings.payoutAlerts} description="Get notified when your earnings are processed or settled." />
            <NotificationToggle id="emailUpdates" label="Critical Email Updates" defaultChecked={settings.emailUpdates} description="Essential service updates and security warnings via email." />
            <NotificationToggle id="marketingEmails" label="Marketing & Promotional Emails" defaultChecked={settings.marketingEmails} description="Receive occasional emails about new features and promotions." />
        </div>
    </FormWrapper>
  );
};
