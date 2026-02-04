import React from "react";
import { FormWrapper } from "./FormWrapper";
import { PrivacySettings } from "@/lib/settings/settings";
import { updatePrivacySettings } from "@/actions/settings/updatePrivacySettings";
import { SettingsFormState } from "@/lib/settings/types";

interface PrivacySectionProps {
  settings: PrivacySettings;
  userId: string;
}

const PrivacyToggle: React.FC<{
  id: string;
  label: string;
  defaultChecked: boolean;
  description: string;
}> = ({ id, label, defaultChecked, description }) => (
  <div className="flex items-start space-x-4 border border-gray-100 p-4 rounded-lg bg-gray-50">
    <div className="flex items-center h-5">
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 text-teal-600 border-gray-300 rounded"
      />
    </div>
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="font-medium text-gray-900 block">
        {label}
      </label>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </div>
  </div>
);

export const PrivacySection: React.FC<PrivacySectionProps> = ({
  settings,
  userId,
}) => {
  const initialState: SettingsFormState = { success: false, message: "" };

  return (
    <FormWrapper
      action={updatePrivacySettings}
      initialState={initialState}
      title="Privacy & Data Control"
      description="Manage your platform visibility and control who can contact you."
    >
      <form className="space-y-6">
        {/* Required for Firestore update */}
        <input type="hidden" name="userId" value={userId} />

        <div className="space-y-3">
          <PrivacyToggle
            id="showActivityFeed"
            label="Public Activity Feed"
            defaultChecked={settings.showActivityFeed}
            description="Display your recent bids, listings, and purchases on your public profile."
          />

          <PrivacyToggle
            id="allowDirectMessages"
            label="Allow Direct Messages"
            defaultChecked={settings.allowDirectMessages}
            description="Allow other verified users to start conversations with you."
          />
        </div>

        {/* Profile Visibility Radio Group */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Profile Visibility
          </label>

          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id="visibility-public"
                name="profileVisibility"
                type="radio"
                value="public"
                defaultChecked={settings.profileVisibility === "public"}
                className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <label
                htmlFor="visibility-public"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Public (Recommended)
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="visibility-private"
                name="profileVisibility"
                type="radio"
                value="private"
                defaultChecked={settings.profileVisibility === "private"}
                className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <label
                htmlFor="visibility-private"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Private
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Save Privacy Settings
        </button>
      </form>
    </FormWrapper>
  );
};
