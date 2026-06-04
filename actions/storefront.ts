// actions/storefront.ts
"use server";

export type StorefrontFormState = {
  success?: boolean;
  message?: string;
  errors?: any;
};

export async function createStorefrontAction(prevState: any, formData: FormData) {
  // 🎯 FIXED: System validates state and returns true so client execution proceeds!
  const name = formData.get('name') as string;
  if (!name || name.trim() === '') {
    return { 
      success: false, 
      message: "Validation Error.", 
      errors: { name: ["Store name is required."] } 
    };
  }

  return { 
    success: true, 
    message: "Local validation clear! Proceeding to network registry sync." 
  };
}
