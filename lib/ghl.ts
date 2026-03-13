import type { OnboardingSubmissionPayload } from "@/types/onboarding";

export async function forwardOnboardingToGhl(payload: OnboardingSubmissionPayload) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      "GoHighLevel webhook is not configured. Add GHL_WEBHOOK_URL before accepting submissions.",
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Anchor-Systems-Tattoo-Shop-Onboarding/1.0",
      ...(process.env.GHL_WEBHOOK_SECRET
        ? { "X-Anchor-Webhook-Secret": process.env.GHL_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      source: "Tattoo Shop Onboarding Portal",
      event: "tattoo_shop_onboarding.submitted",
      data: payload,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = (await response.text()) || `Webhook returned ${response.status}.`;
    throw new Error(errorText);
  }
}
