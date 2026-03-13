import { NextResponse } from "next/server";
import { forwardOnboardingToGhl } from "@/lib/ghl";
import { generateReferenceNumber } from "@/lib/reference";
import { validateAllSteps } from "@/lib/validation";
import type { OnboardingFormData, OnboardingSubmissionPayload } from "@/types/onboarding";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OnboardingFormData;
    const errors = validateAllSteps(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please resolve the highlighted fields and try again.",
          errors,
        },
        { status: 400 },
      );
    }

    const submittedAt = new Date().toISOString();
    const referenceNumber = generateReferenceNumber(new Date(submittedAt));

    const payload: OnboardingSubmissionPayload = {
      ...body,
      submittedAt,
      referenceNumber,
    };

    await forwardOnboardingToGhl(payload);

    return NextResponse.json({
      success: true,
      submittedAt,
      referenceNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We could not submit your onboarding at this time. Please try again.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
