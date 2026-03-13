import type {
  Artist,
  AutomationPreferences,
  Branding,
  CalendarSetup,
  LeadRecipient,
  NotificationMethod,
  OnboardingFormData,
  OperatingModel,
  RoutingPreferences,
  ShopInformation,
  ShopSetup,
  YesNo,
  YesNoSometimes,
} from "@/types/onboarding";

export const stepTitles = [
  "Shop Information",
  "Branding + Shop Setup",
  "Artist Roster",
  "Lead Routing + Notifications",
  "Calendars + AI Numbers",
  "Automations + Final Notes",
  "Review + Submit",
] as const;

export const yesNoOptions: YesNo[] = ["Yes", "No"];
export const yesNoSometimesOptions: YesNoSometimes[] = ["Yes", "No", "Sometimes"];
export const operatingModelOptions: OperatingModel[] = [
  "Owner only",
  "Owner + multiple artists",
  "Booth rental / chair rental artists",
  "Mixed model",
];
export const notificationMethodOptions: NotificationMethod[] = ["SMS", "Email", "Both"];
export const leadRecipientOptions: LeadRecipient[] = [
  "Shop owner",
  "Front desk",
  "General shop inbox",
  "Round robin",
];

export const defaultShopInformation: ShopInformation = {
  shopName: "",
  ownerFullName: "",
  ownerEmail: "",
  ownerPhone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  websiteUrl: "",
  instagramProfile: "",
  facebookPage: "",
  googleBusinessProfileLink: "",
};

export const defaultBranding: Branding = {
  shopLogo: null,
  primaryBrandColor: "#10213d",
  secondaryBrandColor: "#d7b46a",
  mainBusinessPhone: "",
  replyToEmail: "",
  shortDescription: "",
  businessHours: "",
};

export const defaultShopSetup: ShopSetup = {
  operatingModel: "Owner only",
  acceptsWalkIns: "Yes",
  offersPiercings: "No",
  clientsChooseSpecificArtist: "Yes",
  allowGeneralShopInquiries: "Yes",
};

function createId() {
  return `artist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createArtist(): Artist {
  return {
    id: createId(),
    fullName: "",
    email: "",
    mobileNumber: "",
    instagramProfile: "",
    specialties: "",
    takingNewClients: "Yes",
    needsDedicatedAiPhoneNumber: "No",
    receivesDirectLeadNotifications: "Yes",
    preferredNotificationMethod: "Both",
    needsOwnCalendar: "No",
    calendarEmail: "",
    bookingNotificationEmail: "",
    bookingNotificationPhone: "",
    existingBusinessNumber: "",
    inboundCallHandlingNotes: "",
  };
}

export const defaultRoutingPreferences: RoutingPreferences = {
  specificArtistOnlyNotified: "Yes",
  ownerGetsAllLeadCopies: "Yes",
  noArtistSelectedLeadRecipient: "Shop owner",
  primaryNotificationName: "",
  primaryNotificationPhone: "",
  primaryNotificationEmail: "",
  secondaryNotificationName: "",
  secondaryNotificationPhone: "",
  secondaryNotificationEmail: "",
};

export const defaultCalendarSetup: CalendarSetup = {
  mainShopAiPhoneNumber: "Yes",
  dedicatedAiNumbersForArtists: "No",
  generalConsultationCalendar: "Yes",
  eachArtistUsesOwnCalendar: "No",
};

export const defaultAutomationPreferences: AutomationPreferences = {
  enableMissedCallTextBack: "Yes",
  enableAiReceptionist: "Yes",
  enableAppointmentReminders: "Yes",
  enableAftercareFollowUp: "No",
  enableReviewRequestAutomation: "Yes",
  consentForms: [],
  aftercareInstructions: [],
};

export const defaultOnboardingData: OnboardingFormData = {
  shop: defaultShopInformation,
  branding: defaultBranding,
  setup: defaultShopSetup,
  artists: [],
  routing: defaultRoutingPreferences,
  calendars: defaultCalendarSetup,
  automations: defaultAutomationPreferences,
  notes: "",
};

export function createInitialOnboardingData(): OnboardingFormData {
  return {
    shop: { ...defaultShopInformation },
    branding: { ...defaultBranding },
    setup: { ...defaultShopSetup },
    artists: [],
    routing: { ...defaultRoutingPreferences },
    calendars: { ...defaultCalendarSetup },
    automations: {
      ...defaultAutomationPreferences,
      consentForms: [],
      aftercareInstructions: [],
    },
    notes: "",
  };
}
