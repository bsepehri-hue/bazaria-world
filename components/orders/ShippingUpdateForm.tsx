'use client';

import React, { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { markOrderAsShipped } from '@/actions/orders';
import { Truck, CheckCircle, Loader2 } from 'lucide-react';

interface ShippingUpdateFormProps {
  orderId: string;
}

export function ShippingUpdateForm({ orderId }: ShippingUpdateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

 const initialState = {
  success: false,
  error: null,
};

 const initialState = { success: false, error: null };

const [state, formAction] = useFormState(
  markOrderAsShipped,
  initialState
);



  const { pending } = useFormStatus();

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
       <input type="hidden" name="orderId" value={orderId} />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tracking Number
        </label>
        <input
          type="text"
          name="trackingNumber"
          required
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Truck className="w-4 h-4" />
        )}
        Mark as Shipped
      </button>

      {state.success && (
        <p className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          Order marked as shipped.
        </p>
      )}

      {state.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}
    </form>
  );
}
