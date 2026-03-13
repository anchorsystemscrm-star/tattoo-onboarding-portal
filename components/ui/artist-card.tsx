"use client";

import {
  ChoiceCardGroup,
  TextAreaField,
  TextInput,
} from "@/components/ui/form-fields";
import { SectionCard } from "@/components/ui/section-card";
import { notificationMethodOptions, yesNoOptions } from "@/lib/onboarding";
import type { Artist, ValidationErrors } from "@/types/onboarding";

interface ArtistCardProps {
  artist: Artist;
  index: number;
  errors: ValidationErrors;
  onChange: <K extends keyof Artist>(field: K, value: Artist[K]) => void;
  onRemove: () => void;
  showConfigurationFields?: boolean;
}

export function ArtistCard({
  artist,
  index,
  errors,
  onChange,
  onRemove,
  showConfigurationFields = false,
}: ArtistCardProps) {
  const prefix = `artists.${index}`;

  return (
    <SectionCard
      title={`Artist ${index + 1}`}
      description="Capture artist-level routing, notification, calendar, and AI phone setup."
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          Add each artist who needs routing, notification, calendar, or AI phone setup.
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-300/30 hover:bg-rose-400/15"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Artist Full Name"
          value={artist.fullName}
          onChange={(value) => onChange("fullName", value)}
          error={errors[`${prefix}.fullName`]}
          required
          placeholder="Jordan Reyes"
        />
        <TextInput
          label="Artist Email"
          type="email"
          value={artist.email}
          onChange={(value) => onChange("email", value)}
          error={errors[`${prefix}.email`]}
          required
          placeholder="jordan@shop.com"
        />
        <TextInput
          label="Artist Mobile Number"
          type="tel"
          value={artist.mobileNumber}
          onChange={(value) => onChange("mobileNumber", value)}
          error={errors[`${prefix}.mobileNumber`]}
          required
          placeholder="(555) 555-5555"
        />
        <TextInput
          label="Artist Instagram Profile"
          value={artist.instagramProfile}
          onChange={(value) => onChange("instagramProfile", value)}
          error={errors[`${prefix}.instagramProfile`]}
          placeholder="https://instagram.com/artistname"
        />
      </div>

      <TextAreaField
        label="Tattoo Styles / Specialties"
        value={artist.specialties}
        onChange={(value) => onChange("specialties", value)}
        placeholder="Blackwork, realism, floral, fine line..."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceCardGroup
          label="Taking New Clients?"
          options={yesNoOptions}
          value={artist.takingNewClients}
          onChange={(value) => onChange("takingNewClients", value)}
        />
        <ChoiceCardGroup
          label="Needs Dedicated AI Phone Number?"
          options={yesNoOptions}
          value={artist.needsDedicatedAiPhoneNumber}
          onChange={(value) => onChange("needsDedicatedAiPhoneNumber", value)}
        />
        <ChoiceCardGroup
          label="Should this artist receive direct lead notifications?"
          options={yesNoOptions}
          value={artist.receivesDirectLeadNotifications}
          onChange={(value) => onChange("receivesDirectLeadNotifications", value)}
        />
        <ChoiceCardGroup
          label="Preferred Notification Method"
          options={notificationMethodOptions}
          value={artist.preferredNotificationMethod}
          onChange={(value) => onChange("preferredNotificationMethod", value)}
        />
        <ChoiceCardGroup
          label="Needs Their Own Calendar?"
          options={yesNoOptions}
          value={artist.needsOwnCalendar}
          onChange={(value) => onChange("needsOwnCalendar", value)}
        />
      </div>

      {showConfigurationFields ? (
        <div className="space-y-5 rounded-3xl border border-white/10 bg-black/10 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white">Artist Configuration</h3>
            <p className="mt-1 text-sm text-slate-400">
              These fields appear only when this artist needs a calendar or dedicated AI
              phone setup.
            </p>
          </div>
          {artist.needsOwnCalendar === "Yes" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Calendar Email / Login Email"
                type="email"
                value={artist.calendarEmail}
                onChange={(value) => onChange("calendarEmail", value)}
                error={errors[`${prefix}.calendarEmail`]}
                placeholder="calendar@shop.com"
              />
              <TextInput
                label="Booking Notification Email"
                type="email"
                value={artist.bookingNotificationEmail}
                onChange={(value) => onChange("bookingNotificationEmail", value)}
                error={errors[`${prefix}.bookingNotificationEmail`]}
                placeholder="alerts@shop.com"
              />
              <TextInput
                label="Booking Notification Phone"
                type="tel"
                value={artist.bookingNotificationPhone}
                onChange={(value) => onChange("bookingNotificationPhone", value)}
                error={errors[`${prefix}.bookingNotificationPhone`]}
                placeholder="(555) 555-5555"
              />
            </div>
          ) : null}

          {artist.needsDedicatedAiPhoneNumber === "Yes" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Existing Business Number / Forwarding Number"
                type="tel"
                value={artist.existingBusinessNumber}
                onChange={(value) => onChange("existingBusinessNumber", value)}
                error={errors[`${prefix}.existingBusinessNumber`]}
                placeholder="(555) 555-5555"
              />
              <TextAreaField
                label="Preferred Inbound Call Handling Notes"
                value={artist.inboundCallHandlingNotes}
                onChange={(value) => onChange("inboundCallHandlingNotes", value)}
                className="sm:col-span-2"
                placeholder="Notes about artist-specific call handling, screening, or availability."
              />
            </div>
          ) : null}

          {artist.needsOwnCalendar === "No" && artist.needsDedicatedAiPhoneNumber === "No" ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              No additional calendar or AI phone setup is required for this artist right now.
            </p>
          ) : null}
        </div>
      ) : null}
    </SectionCard>
  );
}
