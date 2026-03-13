"use client";

import { useEffect, useState } from "react";
import { ArtistCard } from "@/components/ui/artist-card";
import {
  ChoiceCardGroup,
  ColorField,
  FileUploadField,
  TextAreaField,
  TextInput,
} from "@/components/ui/form-fields";
import { ReviewSection } from "@/components/ui/review-section";
import { SectionCard } from "@/components/ui/section-card";
import { SuccessScreen } from "@/components/ui/success-screen";
import { StepTracker } from "@/components/ui/step-tracker";
import { WelcomeScreen } from "@/components/ui/welcome-screen";
import { COUNTDOWN_SECONDS, MAIN_WEBSITE_URL } from "@/lib/constants";
import {
  createArtist,
  createInitialOnboardingData,
  leadRecipientOptions,
  operatingModelOptions,
  stepTitles,
  yesNoOptions,
  yesNoSometimesOptions,
} from "@/lib/onboarding";
import { findFirstStepWithError, validateAllSteps, validateStep } from "@/lib/validation";
import type {
  Artist,
  OnboardingFormData,
  UploadedFileAsset,
  ValidationErrors,
} from "@/types/onboarding";

interface SubmissionSuccess {
  referenceNumber: string;
}

function toUploadedFileAsset(file: File): UploadedFileAsset {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
}

export function OnboardingPortal() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingFormData>(() => createInitialOnboardingData());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<SubmissionSuccess | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!success) return;

    if (countdown <= 0) {
      window.location.assign(MAIN_WEBSITE_URL);
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, success]);

  function clearError(key: string) {
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateSection<T extends keyof OnboardingFormData>(
    section: T,
    value: OnboardingFormData[T],
  ) {
    setSubmitError(null);
    setData((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function updateNestedSection<
    T extends keyof Pick<
      OnboardingFormData,
      "shop" | "branding" | "setup" | "routing" | "calendars"
    >,
    K extends keyof OnboardingFormData[T],
  >(section: T, field: K, value: OnboardingFormData[T][K]) {
    setSubmitError(null);
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      } as OnboardingFormData[T],
    }));
    clearError(`${String(section)}.${String(field)}`);
  }

  function updateArtist(artistId: string, field: keyof Artist, value: Artist[keyof Artist]) {
    setSubmitError(null);
    setData((current) => ({
      ...current,
      artists: current.artists.map((artist) =>
        artist.id === artistId ? { ...artist, [field]: value } : artist,
      ),
    }));

    const artistIndex = data.artists.findIndex((artist) => artist.id === artistId);
    if (artistIndex >= 0) {
      clearError(`artists.${artistIndex}.${String(field)}`);
    }
  }

  function removeArtist(artistId: string) {
    setSubmitError(null);
    setData((current) => ({
      ...current,
      artists: current.artists.filter((artist) => artist.id !== artistId),
    }));
    setErrors((current) => {
      const next: ValidationErrors = {};

      for (const [key, value] of Object.entries(current)) {
        if (!key.startsWith("artists")) {
          next[key] = value;
        }
      }

      return next;
    });
  }

  function handleLogoUpload(files: FileList | null) {
    const file = files?.[0];
    // File metadata is captured now; wire Vercel Blob, S3, or Supabase later for durable storage.
    updateNestedSection("branding", "shopLogo", file ? toUploadedFileAsset(file) : null);
  }

  function handleMultiFileUpload(
    field: "consentForms" | "aftercareInstructions",
    files: FileList | null,
  ) {
    // This keeps the payload lightweight until a storage provider is added server-side.
    updateSection("automations", {
      ...data.automations,
      [field]: files ? Array.from(files).map(toUploadedFileAsset) : [],
    });
  }

  function handleNext() {
    const stepErrors = validateStep(currentStep, data);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentStep((step) => Math.min(stepTitles.length, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(1, step - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const fullErrors = validateAllSteps(data);
    setErrors(fullErrors);
    setSubmitError(null);

    if (Object.keys(fullErrors).length > 0) {
      setCurrentStep(findFirstStepWithError(fullErrors));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        success: boolean;
        referenceNumber?: string;
        message?: string;
        errors?: ValidationErrors;
      };

      if (!response.ok || !result.success || !result.referenceNumber) {
        if (result.errors) {
          setErrors(result.errors);
          setCurrentStep(findFirstStepWithError(result.errors));
        }
        throw new Error(
          result.message ||
            "We could not submit your onboarding right now. Please review your details and try again.",
        );
      }

      setSuccess({ referenceNumber: result.referenceNumber });
      setCountdown(COUNTDOWN_SECONDS);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your onboarding right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const artistGuidance =
    data.setup.operatingModel === "Owner only"
      ? "Add yourself or another artist only if separate routing, calendars, or AI numbers are needed."
      : "At least one artist is recommended so we can configure routing, notifications, and calendar ownership.";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Anchor Systems</p>
            <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
              Tattoo Shop Onboarding Portal
            </h1>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 sm:block">
            Mobile-first. Built for a smooth 8 to 10 minute completion.
          </div>
        </header>

        {!started ? (
          <WelcomeScreen onBegin={() => setStarted(true)} />
        ) : success ? (
          <SuccessScreen referenceNumber={success.referenceNumber} countdown={countdown} />
        ) : (
          <div className="panel overflow-hidden">
            <StepTracker currentStep={currentStep} steps={stepTitles} />
            <div className="space-y-6 p-4 sm:p-6">
              {submitError ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {submitError}
                </div>
              ) : null}

              <div className="step-fade">
                {currentStep === 1 ? (
                  <SectionCard
                    title="Shop Information"
                    description="Start with the core shop and owner details Anchor Systems needs to set up your account."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput
                        label="Shop Name"
                        value={data.shop.shopName}
                        onChange={(value) => updateNestedSection("shop", "shopName", value)}
                        error={errors["shop.shopName"]}
                        required
                        placeholder="Black Harbor Tattoo"
                      />
                      <TextInput
                        label="Owner / Main Admin Full Name"
                        value={data.shop.ownerFullName}
                        onChange={(value) => updateNestedSection("shop", "ownerFullName", value)}
                        error={errors["shop.ownerFullName"]}
                        required
                        placeholder="Alex Monroe"
                      />
                      <TextInput
                        label="Owner / Main Admin Email"
                        type="email"
                        value={data.shop.ownerEmail}
                        onChange={(value) => updateNestedSection("shop", "ownerEmail", value)}
                        error={errors["shop.ownerEmail"]}
                        required
                        placeholder="alex@shop.com"
                      />
                      <TextInput
                        label="Owner / Main Admin Phone"
                        type="tel"
                        value={data.shop.ownerPhone}
                        onChange={(value) => updateNestedSection("shop", "ownerPhone", value)}
                        error={errors["shop.ownerPhone"]}
                        required
                        placeholder="(555) 555-5555"
                      />
                      <TextInput
                        label="Shop Address Line 1"
                        value={data.shop.addressLine1}
                        onChange={(value) => updateNestedSection("shop", "addressLine1", value)}
                        placeholder="123 Main Street"
                      />
                      <TextInput
                        label="Shop Address Line 2"
                        value={data.shop.addressLine2}
                        onChange={(value) => updateNestedSection("shop", "addressLine2", value)}
                        placeholder="Suite 4"
                      />
                      <TextInput
                        label="City"
                        value={data.shop.city}
                        onChange={(value) => updateNestedSection("shop", "city", value)}
                        placeholder="Miami"
                      />
                      <TextInput
                        label="State"
                        value={data.shop.state}
                        onChange={(value) => updateNestedSection("shop", "state", value)}
                        placeholder="FL"
                      />
                      <TextInput
                        label="Zip"
                        value={data.shop.zip}
                        onChange={(value) => updateNestedSection("shop", "zip", value)}
                        placeholder="33101"
                      />
                      <TextInput
                        label="Website URL"
                        value={data.shop.websiteUrl}
                        onChange={(value) => updateNestedSection("shop", "websiteUrl", value)}
                        error={errors["shop.websiteUrl"]}
                        placeholder="https://yourshop.com"
                      />
                      <TextInput
                        label="Instagram Profile"
                        value={data.shop.instagramProfile}
                        onChange={(value) =>
                          updateNestedSection("shop", "instagramProfile", value)
                        }
                        error={errors["shop.instagramProfile"]}
                        placeholder="https://instagram.com/yourshop"
                      />
                      <TextInput
                        label="Facebook Page"
                        value={data.shop.facebookPage}
                        onChange={(value) => updateNestedSection("shop", "facebookPage", value)}
                        error={errors["shop.facebookPage"]}
                        placeholder="https://facebook.com/yourshop"
                      />
                      <TextInput
                        label="Google Business Profile Link"
                        value={data.shop.googleBusinessProfileLink}
                        onChange={(value) =>
                          updateNestedSection("shop", "googleBusinessProfileLink", value)
                        }
                        error={errors["shop.googleBusinessProfileLink"]}
                        placeholder="https://g.page/r/..."
                      />
                    </div>
                  </SectionCard>
                ) : null}

                {currentStep === 2 ? (
                  <div className="space-y-6">
                    <SectionCard
                      title="Branding"
                      description="Collect the brand assets and shop presentation details needed for the sub-account build."
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FileUploadField
                          label="Upload Shop Logo"
                          files={data.branding.shopLogo}
                          onChange={handleLogoUpload}
                          accept="image/*,.pdf,.svg"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <ColorField
                            label="Primary Brand Color"
                            value={data.branding.primaryBrandColor}
                            onChange={(value) =>
                              updateNestedSection("branding", "primaryBrandColor", value)
                            }
                            helperText="Hex color recommended."
                          />
                          <ColorField
                            label="Secondary Brand Color"
                            value={data.branding.secondaryBrandColor}
                            onChange={(value) =>
                              updateNestedSection("branding", "secondaryBrandColor", value)
                            }
                            helperText="Use a contrasting accent color."
                          />
                        </div>
                        <TextInput
                          label="Main Public Business Phone Number"
                          type="tel"
                          value={data.branding.mainBusinessPhone}
                          onChange={(value) =>
                            updateNestedSection("branding", "mainBusinessPhone", value)
                          }
                          error={errors["branding.mainBusinessPhone"]}
                          placeholder="(555) 555-5555"
                        />
                        <TextInput
                          label="Main Reply-To Email"
                          type="email"
                          value={data.branding.replyToEmail}
                          onChange={(value) =>
                            updateNestedSection("branding", "replyToEmail", value)
                          }
                          error={errors["branding.replyToEmail"]}
                          placeholder="hello@shop.com"
                        />
                      </div>
                      <TextAreaField
                        label="Short Shop Description"
                        value={data.branding.shortDescription}
                        onChange={(value) =>
                          updateNestedSection("branding", "shortDescription", value)
                        }
                        placeholder="Describe the shop, the vibe, and what makes the experience distinct."
                      />
                      <TextAreaField
                        label="Shop Hours / Business Hours"
                        value={data.branding.businessHours}
                        onChange={(value) =>
                          updateNestedSection("branding", "businessHours", value)
                        }
                        placeholder="Monday-Friday 10am-7pm, Saturday 11am-5pm..."
                      />
                    </SectionCard>

                    <SectionCard
                      title="Shop Setup"
                      description="These operational choices shape lead routing, calendars, and AI phone logic."
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ChoiceCardGroup
                          label="How does your shop operate?"
                          options={operatingModelOptions}
                          value={data.setup.operatingModel}
                          onChange={(value) =>
                            updateNestedSection("setup", "operatingModel", value)
                          }
                          columns="grid-cols-1"
                        />
                        <ChoiceCardGroup
                          label="Do you accept walk-ins?"
                          options={yesNoOptions}
                          value={data.setup.acceptsWalkIns}
                          onChange={(value) =>
                            updateNestedSection("setup", "acceptsWalkIns", value)
                          }
                        />
                        <ChoiceCardGroup
                          label="Do you offer piercings?"
                          options={yesNoOptions}
                          value={data.setup.offersPiercings}
                          onChange={(value) =>
                            updateNestedSection("setup", "offersPiercings", value)
                          }
                        />
                        <ChoiceCardGroup
                          label="Do clients choose a specific artist when booking?"
                          options={yesNoSometimesOptions}
                          value={data.setup.clientsChooseSpecificArtist}
                          onChange={(value) =>
                            updateNestedSection("setup", "clientsChooseSpecificArtist", value)
                          }
                          columns="grid-cols-1 sm:grid-cols-3"
                        />
                        <ChoiceCardGroup
                          label="Do you allow general shop inquiries not assigned to a specific artist?"
                          options={yesNoOptions}
                          value={data.setup.allowGeneralShopInquiries}
                          onChange={(value) =>
                            updateNestedSection("setup", "allowGeneralShopInquiries", value)
                          }
                        />
                      </div>
                    </SectionCard>
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="space-y-6">
                    <SectionCard
                      title="Artist Roster"
                      description={artistGuidance}
                    >
                      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-2xl text-sm leading-7 text-slate-300">
                          Artist cards are repeatable so you can capture each person who needs
                          their own routing, notifications, calendar, or AI phone number.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitError(null);
                            setData((current) => ({
                              ...current,
                              artists: [...current.artists, createArtist()],
                            }));
                            clearError("artists");
                          }}
                          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#08111f] transition hover:opacity-90"
                        >
                          Add Artist
                        </button>
                      </div>
                      {errors.artists ? (
                        <p className="text-sm text-rose-300">{errors.artists}</p>
                      ) : null}
                    </SectionCard>

                    {data.artists.length > 0 ? (
                      data.artists.map((artist, index) => (
                        <ArtistCard
                          key={artist.id}
                          artist={artist}
                          index={index}
                          errors={errors}
                          onChange={(field, value) => updateArtist(artist.id, field, value)}
                          onRemove={() => removeArtist(artist.id)}
                        />
                      ))
                    ) : (
                      <SectionCard
                        title="No Artists Added Yet"
                        description="If the shop is owner-only, you can continue without artist cards. Otherwise add at least one artist before moving on."
                      >
                        <p className="text-sm leading-7 text-slate-300">
                          You can still move forward now if the shop only needs a single owner setup,
                          but most multi-artist shops should add their roster here.
                        </p>
                      </SectionCard>
                    )}
                  </div>
                ) : null}

                {currentStep === 4 ? (
                  <SectionCard
                    title="Lead Routing + Notifications"
                    description="Define who receives leads first and how notifications should be copied across the shop."
                  >
                    {data.setup.clientsChooseSpecificArtist === "No" ? (
                      <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
                        Client requests do not typically select a specific artist, so general lead
                        routing will be used more often than artist-specific notifications.
                      </div>
                    ) : null}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ChoiceCardGroup
                        label="When a client selects a specific artist, should only that artist be notified?"
                        options={yesNoOptions}
                        value={data.routing.specificArtistOnlyNotified}
                        onChange={(value) =>
                          updateNestedSection("routing", "specificArtistOnlyNotified", value)
                        }
                      />
                      <ChoiceCardGroup
                        label="Should the shop owner also receive a copy of all new lead notifications?"
                        options={yesNoOptions}
                        value={data.routing.ownerGetsAllLeadCopies}
                        onChange={(value) =>
                          updateNestedSection("routing", "ownerGetsAllLeadCopies", value)
                        }
                      />
                      <ChoiceCardGroup
                        label="If no artist is selected, who should receive the lead first?"
                        options={leadRecipientOptions}
                        value={data.routing.noArtistSelectedLeadRecipient}
                        onChange={(value) =>
                          updateNestedSection("routing", "noArtistSelectedLeadRecipient", value)
                        }
                        columns="grid-cols-1"
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4 rounded-3xl border border-white/10 bg-black/10 p-5">
                        <h3 className="text-lg font-semibold text-white">Primary Notification Contact</h3>
                        <TextInput
                          label="Primary Notification Name"
                          value={data.routing.primaryNotificationName}
                          onChange={(value) =>
                            updateNestedSection("routing", "primaryNotificationName", value)
                          }
                          placeholder="Front Desk"
                        />
                        <TextInput
                          label="Primary Notification Phone"
                          type="tel"
                          value={data.routing.primaryNotificationPhone}
                          onChange={(value) =>
                            updateNestedSection("routing", "primaryNotificationPhone", value)
                          }
                          error={errors["routing.primaryNotificationPhone"]}
                          placeholder="(555) 555-5555"
                        />
                        <TextInput
                          label="Primary Notification Email"
                          type="email"
                          value={data.routing.primaryNotificationEmail}
                          onChange={(value) =>
                            updateNestedSection("routing", "primaryNotificationEmail", value)
                          }
                          error={errors["routing.primaryNotificationEmail"]}
                          placeholder="frontdesk@shop.com"
                        />
                      </div>
                      <div className="space-y-4 rounded-3xl border border-white/10 bg-black/10 p-5">
                        <h3 className="text-lg font-semibold text-white">
                          Secondary Notification Contact
                        </h3>
                        <TextInput
                          label="Secondary Notification Name"
                          value={data.routing.secondaryNotificationName}
                          onChange={(value) =>
                            updateNestedSection("routing", "secondaryNotificationName", value)
                          }
                          placeholder="Owner Backup"
                        />
                        <TextInput
                          label="Secondary Notification Phone"
                          type="tel"
                          value={data.routing.secondaryNotificationPhone}
                          onChange={(value) =>
                            updateNestedSection("routing", "secondaryNotificationPhone", value)
                          }
                          error={errors["routing.secondaryNotificationPhone"]}
                          placeholder="(555) 555-5555"
                        />
                        <TextInput
                          label="Secondary Notification Email"
                          type="email"
                          value={data.routing.secondaryNotificationEmail}
                          onChange={(value) =>
                            updateNestedSection("routing", "secondaryNotificationEmail", value)
                          }
                          error={errors["routing.secondaryNotificationEmail"]}
                          placeholder="owner@shop.com"
                        />
                      </div>
                    </div>
                  </SectionCard>
                ) : null}

                {currentStep === 5 ? (
                  <div className="space-y-6">
                    <SectionCard
                      title="Calendars + AI Numbers"
                      description="Set the shop-level defaults first, then refine the artist-level calendar and AI phone setup below."
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ChoiceCardGroup
                          label="Do you want a main shop AI phone number?"
                          options={yesNoOptions}
                          value={data.calendars.mainShopAiPhoneNumber}
                          onChange={(value) =>
                            updateNestedSection("calendars", "mainShopAiPhoneNumber", value)
                          }
                        />
                        <ChoiceCardGroup
                          label="Do you want dedicated AI phone numbers for individual artists?"
                          options={yesNoOptions}
                          value={data.calendars.dedicatedAiNumbersForArtists}
                          onChange={(value) =>
                            updateNestedSection("calendars", "dedicatedAiNumbersForArtists", value)
                          }
                        />
                        <ChoiceCardGroup
                          label="Does the shop need a general consultation calendar?"
                          options={yesNoOptions}
                          value={data.calendars.generalConsultationCalendar}
                          onChange={(value) =>
                            updateNestedSection("calendars", "generalConsultationCalendar", value)
                          }
                        />
                        <ChoiceCardGroup
                          label="Will each artist use their own booking calendar?"
                          options={yesNoOptions}
                          value={data.calendars.eachArtistUsesOwnCalendar}
                          onChange={(value) =>
                            updateNestedSection("calendars", "eachArtistUsesOwnCalendar", value)
                          }
                        />
                      </div>
                    </SectionCard>

                    {data.artists.length > 0 ? (
                      data.artists.map((artist, index) => (
                        <ArtistCard
                          key={`${artist.id}-configuration`}
                          artist={artist}
                          index={index}
                          errors={errors}
                          showConfigurationFields
                          onChange={(field, value) => updateArtist(artist.id, field, value)}
                          onRemove={() => removeArtist(artist.id)}
                        />
                      ))
                    ) : (
                      <SectionCard
                        title="No Artist-Level Configuration Needed Yet"
                        description="Artist-specific calendar and AI phone fields will appear here after you add artist cards."
                      >
                        <p className="text-sm leading-7 text-slate-300">
                          You can continue if the shop only needs a main line and shop-level
                          calendar setup.
                        </p>
                      </SectionCard>
                    )}
                  </div>
                ) : null}

                {currentStep === 6 ? (
                  <SectionCard
                    title="Automations + Final Notes"
                    description="These preferences help Anchor Systems configure the right automation stack on day one."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ChoiceCardGroup
                        label="Enable missed call text back?"
                        options={yesNoOptions}
                        value={data.automations.enableMissedCallTextBack}
                        onChange={(value) =>
                          updateSection("automations", {
                            ...data.automations,
                            enableMissedCallTextBack: value,
                          })
                        }
                      />
                      <ChoiceCardGroup
                        label="Enable AI receptionist?"
                        options={yesNoOptions}
                        value={data.automations.enableAiReceptionist}
                        onChange={(value) =>
                          updateSection("automations", {
                            ...data.automations,
                            enableAiReceptionist: value,
                          })
                        }
                      />
                      <ChoiceCardGroup
                        label="Enable appointment reminders?"
                        options={yesNoOptions}
                        value={data.automations.enableAppointmentReminders}
                        onChange={(value) =>
                          updateSection("automations", {
                            ...data.automations,
                            enableAppointmentReminders: value,
                          })
                        }
                      />
                      <ChoiceCardGroup
                        label="Enable aftercare follow-up?"
                        options={yesNoOptions}
                        value={data.automations.enableAftercareFollowUp}
                        onChange={(value) =>
                          updateSection("automations", {
                            ...data.automations,
                            enableAftercareFollowUp: value,
                          })
                        }
                      />
                      <ChoiceCardGroup
                        label="Enable review request automation?"
                        options={yesNoOptions}
                        value={data.automations.enableReviewRequestAutomation}
                        onChange={(value) =>
                          updateSection("automations", {
                            ...data.automations,
                            enableReviewRequestAutomation: value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FileUploadField
                        label="Upload Consent Forms (optional)"
                        files={data.automations.consentForms}
                        onChange={(files) => handleMultiFileUpload("consentForms", files)}
                        multiple
                        accept=".pdf,.doc,.docx,image/*"
                      />
                      <FileUploadField
                        label="Upload Aftercare Instructions (optional)"
                        files={data.automations.aftercareInstructions}
                        onChange={(files) => handleMultiFileUpload("aftercareInstructions", files)}
                        multiple
                        accept=".pdf,.doc,.docx,image/*"
                      />
                    </div>
                    <TextAreaField
                      label="Anything else we should know about how your shop or artists operate?"
                      value={data.notes}
                      onChange={(value) => updateSection("notes", value)}
                      placeholder="Share routing nuances, artist exceptions, booking rules, front desk workflows, or anything else the build team should know."
                    />
                  </SectionCard>
                ) : null}

                {currentStep === 7 ? <ReviewSection data={data} /> : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-white/20 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStarted(false);
                      setCurrentStep(1);
                    }}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.03]"
                  >
                    Back to Welcome
                  </button>
                  {currentStep < stepTitles.length ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-full bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#08111f] transition hover:opacity-90"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#08111f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Onboarding"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
