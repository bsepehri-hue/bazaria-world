import { FormWrapper } from "./FormWrapper";
import { StripeConnectActions } from "@/components/settings/StripeConnectActions";

import { SettingsFormState } from "@/lib/settings/types";
import { UserSettings } from "@/lib/settings/settings";
import { updatePayoutSettings } from "@/actions/settings/updatePayoutSettings";

type PayoutPreferencesProps = {
  settings: UserSettings;
  userId: string;
};

export default function PayoutPreferences({ settings, userId }: PayoutPreferencesProps) {
  const initialState: SettingsFormState = { success: false, message: "" };

  return (
    <FormWrapper
      action={updatePayoutSettings}
      initialState={initialState}
      title="Payouts & Financial Preferences"
      description="Configure your preferred token for smart contract payouts and set settlement frequency."
    >
      <form className="space-y-6">
        {/* Required for Firestore update */}
        <input type="hidden" name="userId" value={userId} />

        {/* Fiat Payout Integration (Stripe) */}
        <div className="border border-teal-300 p-4 rounded-xl bg-teal-50 shadow-inner">
          <h4 className="font-semibold text-teal-800 mb-2">
            Fiat Payouts (Stripe Connect)
          </h4>
          <StripeConnectActions userId={settings.userId} email={settings.email} />
        </div>

        {/* Token Payout Integration */}
        <div className="border border-gray-300 p-4 rounded-xl bg-gray-50 shadow-inner">
          <h4 className="font-semibold text-gray-800 mb-2">
            Token Payouts (Smart Contract)
          </h4>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Token Address
          </label>
          <input
            type="text"
            required
            defaultValue={settings.payouts.preferredToken}
            className="w-full p-3 border border-gray-300 rounded-lg font-mono"
            name="preferredToken"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Settlement Frequency
          </label>
          <select
            defaultValue={settings.payouts.frequency}
            className="w-full p-3 border border-gray-300 rounded-lg"
            name="frequency"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Save Payout Settings
        </button>
      </form>
    </FormWrapper>
  );
}
