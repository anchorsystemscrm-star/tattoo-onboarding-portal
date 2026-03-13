export type YesNo = "Yes" | "No";
export type YesNoSometimes = "Yes" | "No" | "Sometimes";
export type NotificationMethod = "SMS" | "Email" | "Both";
export type OperatingModel =
  | "Owner only"
  | "Owner + multiple artists"
  | "Booth rental / chair rental artists"
  | "Mixed model";
export type LeadRecipient =
  | "Shop owner"
  | "Front desk"
  | "General shop inbox"
  | "Round robin";

export interface UploadedFileAsset {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ShopInformation {
  shopName: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  websiteUrl: string;
  instagramProfile: string;
  facebookPage: string;
  googleBusinessProfileLink: string;
}

export interface Branding {
  shopLogo: UploadedFileAsset | null;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  mainBusinessPhone: string;
  replyToEmail: string;
  shortDescription: string;
  businessHours: string;
}

export interface ShopSetup {
  operatingModel: OperatingModel;
  acceptsWalkIns: YesNo;
  offersPiercings: YesNo;
  clientsChooseSpecificArtist: YesNoSometimes;
  allowGeneralShopInquiries: YesNo;
}

export interface Artist {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  instagramProfile: string;
  specialties: string;
  takingNewClients: YesNo;
  needsDedicatedAiPhoneNumber: YesNo;
  receivesDirectLeadNotifications: YesNo;
  preferredNotificationMethod: NotificationMethod;
  needsOwnCalendar: YesNo;
  calendarEmail: string;
  bookingNotificationEmail: string;
  bookingNotificationPhone: string;
  existingBusinessNumber: string;
  inboundCallHandlingNotes: string;
}

export interface RoutingPreferences {
  specificArtistOnlyNotified: YesNo;
  ownerGetsAllLeadCopies: YesNo;
  noArtistSelectedLeadRecipient: LeadRecipient;
  primaryNotificationName: string;
  primaryNotificationPhone: string;
  primaryNotificationEmail: string;
  secondaryNotificationName: string;
  secondaryNotificationPhone: string;
  secondaryNotificationEmail: string;
}

export interface CalendarSetup {
  mainShopAiPhoneNumber: YesNo;
  dedicatedAiNumbersForArtists: YesNo;
  generalConsultationCalendar: YesNo;
  eachArtistUsesOwnCalendar: YesNo;
}

export interface AutomationPreferences {
  enableMissedCallTextBack: YesNo;
  enableAiReceptionist: YesNo;
  enableAppointmentReminders: YesNo;
  enableAftercareFollowUp: YesNo;
  enableReviewRequestAutomation: YesNo;
  consentForms: UploadedFileAsset[];
  aftercareInstructions: UploadedFileAsset[];
}

export interface OnboardingFormData {
  shop: ShopInformation;
  branding: Branding;
  setup: ShopSetup;
  artists: Artist[];
  routing: RoutingPreferences;
  calendars: CalendarSetup;
  automations: AutomationPreferences;
  notes: string;
}

export interface OnboardingSubmissionPayload extends OnboardingFormData {
  referenceNumber: string;
  submittedAt: string;
}

export type ValidationErrors = Record<string, string>;
