import { SectionCard } from "@/components/ui/section-card";
import type { Artist, OnboardingFormData, UploadedFileAsset } from "@/types/onboarding";

function ReviewGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string | string[] | UploadedFileAsset[] | UploadedFileAsset | null;
  }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map(({ label, value }) => {
        const content = Array.isArray(value)
          ? value.length > 0
            ? value.map((entry) => (typeof entry === "string" ? entry : entry.name)).join(", ")
            : "Not provided"
          : value && value !== ""
            ? typeof value === "string"
              ? value
              : value.name
            : "Not provided";

        return (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{content}</p>
          </div>
        );
      })}
    </div>
  );
}

function ArtistSummary({ artist, index }: { artist: Artist; index: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/10 p-5">
      <h4 className="text-lg font-semibold text-white">
        Artist {index + 1}: {artist.fullName || "Unnamed Artist"}
      </h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {artist.email || "No email"}
            <br />
            {artist.mobileNumber || "No phone"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Setup</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            New Clients: {artist.takingNewClients}
            <br />
            Direct Notifications: {artist.receivesDirectLeadNotifications}
            <br />
            Notification Method: {artist.preferredNotificationMethod}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Phone</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Dedicated Number: {artist.needsDedicatedAiPhoneNumber}
            <br />
            Forwarding Number: {artist.existingBusinessNumber || "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Calendar</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Own Calendar: {artist.needsOwnCalendar}
            <br />
            Calendar Email: {artist.calendarEmail || "Not provided"}
          </p>
        </div>
      </div>
      {artist.specialties ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Specialties</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{artist.specialties}</p>
        </div>
      ) : null}
      {artist.inboundCallHandlingNotes ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Inbound Call Notes</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{artist.inboundCallHandlingNotes}</p>
        </div>
      ) : null}
    </div>
  );
}

export function ReviewSection({ data }: { data: OnboardingFormData }) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Review Your Onboarding"
        description="Double-check the details below before sending your onboarding to Anchor Systems."
        tone="accent"
      >
        <ReviewGrid
          items={[
            { label: "Shop Name", value: data.shop.shopName },
            { label: "Owner / Main Admin", value: data.shop.ownerFullName },
            { label: "Owner Email", value: data.shop.ownerEmail },
            { label: "Owner Phone", value: data.shop.ownerPhone },
            {
              label: "Address",
              value:
                [
                  data.shop.addressLine1,
                  data.shop.addressLine2,
                  data.shop.city,
                  data.shop.state,
                  data.shop.zip,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided",
            },
            { label: "Website", value: data.shop.websiteUrl },
            { label: "Instagram", value: data.shop.instagramProfile },
            { label: "Facebook", value: data.shop.facebookPage },
            { label: "Google Business Profile", value: data.shop.googleBusinessProfileLink },
          ]}
        />
      </SectionCard>

      <SectionCard title="Branding + Setup">
        <ReviewGrid
          items={[
            { label: "Shop Logo", value: data.branding.shopLogo },
            { label: "Primary Brand Color", value: data.branding.primaryBrandColor },
            { label: "Secondary Brand Color", value: data.branding.secondaryBrandColor },
            { label: "Main Public Business Phone", value: data.branding.mainBusinessPhone },
            { label: "Reply-To Email", value: data.branding.replyToEmail },
            { label: "Shop Description", value: data.branding.shortDescription },
            { label: "Business Hours", value: data.branding.businessHours },
            { label: "Operating Model", value: data.setup.operatingModel },
            { label: "Accept Walk-Ins", value: data.setup.acceptsWalkIns },
            { label: "Offer Piercings", value: data.setup.offersPiercings },
            {
              label: "Clients Choose Specific Artist",
              value: data.setup.clientsChooseSpecificArtist,
            },
            {
              label: "General Shop Inquiries Allowed",
              value: data.setup.allowGeneralShopInquiries,
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Artist Roster">
        {data.artists.length > 0 ? (
          <div className="space-y-4">
            {data.artists.map((artist, index) => (
              <ArtistSummary key={artist.id} artist={artist} index={index} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-400">
            No artist records were added.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Routing + Notifications">
        <ReviewGrid
          items={[
            {
              label: "Only Selected Artist Notified",
              value: data.routing.specificArtistOnlyNotified,
            },
            {
              label: "Owner Gets All Lead Copies",
              value: data.routing.ownerGetsAllLeadCopies,
            },
            {
              label: "No Artist Selected Recipient",
              value: data.routing.noArtistSelectedLeadRecipient,
            },
            { label: "Primary Notification Name", value: data.routing.primaryNotificationName },
            { label: "Primary Notification Phone", value: data.routing.primaryNotificationPhone },
            { label: "Primary Notification Email", value: data.routing.primaryNotificationEmail },
            {
              label: "Secondary Notification Name",
              value: data.routing.secondaryNotificationName,
            },
            {
              label: "Secondary Notification Phone",
              value: data.routing.secondaryNotificationPhone,
            },
            {
              label: "Secondary Notification Email",
              value: data.routing.secondaryNotificationEmail,
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Calendars + AI Numbers">
        <ReviewGrid
          items={[
            {
              label: "Main Shop AI Phone Number",
              value: data.calendars.mainShopAiPhoneNumber,
            },
            {
              label: "Dedicated AI Numbers For Artists",
              value: data.calendars.dedicatedAiNumbersForArtists,
            },
            {
              label: "General Consultation Calendar",
              value: data.calendars.generalConsultationCalendar,
            },
            {
              label: "Each Artist Uses Own Calendar",
              value: data.calendars.eachArtistUsesOwnCalendar,
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Automations + Final Notes">
        <ReviewGrid
          items={[
            {
              label: "Missed Call Text Back",
              value: data.automations.enableMissedCallTextBack,
            },
            {
              label: "AI Receptionist",
              value: data.automations.enableAiReceptionist,
            },
            {
              label: "Appointment Reminders",
              value: data.automations.enableAppointmentReminders,
            },
            {
              label: "Aftercare Follow-Up",
              value: data.automations.enableAftercareFollowUp,
            },
            {
              label: "Review Request Automation",
              value: data.automations.enableReviewRequestAutomation,
            },
            { label: "Consent Forms", value: data.automations.consentForms },
            {
              label: "Aftercare Instructions",
              value: data.automations.aftercareInstructions,
            },
            { label: "Final Notes", value: data.notes },
          ]}
        />
      </SectionCard>
    </div>
  );
}
