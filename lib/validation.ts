import type { Artist, OnboardingFormData, ValidationErrors } from "@/types/onboarding";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern =
  /^(\+?1[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?:\s?(?:x|ext\.?)\s?\d+)?$/i;

function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

function isValidPhone(value: string) {
  return phonePattern.test(value.trim());
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function addError(errors: ValidationErrors, key: string, message: string) {
  if (!errors[key]) {
    errors[key] = message;
  }
}

function validateArtist(index: number, artist: Artist, errors: ValidationErrors) {
  if (!artist.fullName.trim()) {
    addError(errors, `artists.${index}.fullName`, "Artist full name is required.");
  }
  if (!artist.email.trim()) {
    addError(errors, `artists.${index}.email`, "Artist email is required.");
  } else if (!isValidEmail(artist.email)) {
    addError(errors, `artists.${index}.email`, "Enter a valid artist email.");
  }
  if (!artist.mobileNumber.trim()) {
    addError(errors, `artists.${index}.mobileNumber`, "Artist mobile number is required.");
  } else if (!isValidPhone(artist.mobileNumber)) {
    addError(errors, `artists.${index}.mobileNumber`, "Enter a valid mobile number.");
  }
  if (artist.instagramProfile && !isValidUrl(artist.instagramProfile)) {
    addError(errors, `artists.${index}.instagramProfile`, "Enter a valid Instagram URL.");
  }
  if (artist.needsOwnCalendar === "Yes" && artist.calendarEmail && !isValidEmail(artist.calendarEmail)) {
    addError(errors, `artists.${index}.calendarEmail`, "Enter a valid calendar email.");
  }
  if (
    artist.needsOwnCalendar === "Yes" &&
    artist.bookingNotificationEmail &&
    !isValidEmail(artist.bookingNotificationEmail)
  ) {
    addError(
      errors,
      `artists.${index}.bookingNotificationEmail`,
      "Enter a valid booking notification email.",
    );
  }
  if (
    artist.needsOwnCalendar === "Yes" &&
    artist.bookingNotificationPhone &&
    !isValidPhone(artist.bookingNotificationPhone)
  ) {
    addError(
      errors,
      `artists.${index}.bookingNotificationPhone`,
      "Enter a valid booking notification phone.",
    );
  }
  if (
    artist.needsDedicatedAiPhoneNumber === "Yes" &&
    artist.existingBusinessNumber &&
    !isValidPhone(artist.existingBusinessNumber)
  ) {
    addError(
      errors,
      `artists.${index}.existingBusinessNumber`,
      "Enter a valid business or forwarding number.",
    );
  }
}

export function validateStep(step: number, data: OnboardingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!data.shop.shopName.trim()) {
      addError(errors, "shop.shopName", "Shop name is required.");
    }
    if (!data.shop.ownerFullName.trim()) {
      addError(errors, "shop.ownerFullName", "Owner or main admin name is required.");
    }
    if (!data.shop.ownerEmail.trim()) {
      addError(errors, "shop.ownerEmail", "Owner or main admin email is required.");
    } else if (!isValidEmail(data.shop.ownerEmail)) {
      addError(errors, "shop.ownerEmail", "Enter a valid email address.");
    }
    if (!data.shop.ownerPhone.trim()) {
      addError(errors, "shop.ownerPhone", "Owner or main admin phone is required.");
    } else if (!isValidPhone(data.shop.ownerPhone)) {
      addError(errors, "shop.ownerPhone", "Enter a valid phone number.");
    }
    if (data.shop.websiteUrl && !isValidUrl(data.shop.websiteUrl)) {
      addError(errors, "shop.websiteUrl", "Enter a valid website URL.");
    }
    if (data.shop.instagramProfile && !isValidUrl(data.shop.instagramProfile)) {
      addError(errors, "shop.instagramProfile", "Enter a valid Instagram URL.");
    }
    if (data.shop.facebookPage && !isValidUrl(data.shop.facebookPage)) {
      addError(errors, "shop.facebookPage", "Enter a valid Facebook URL.");
    }
    if (data.shop.googleBusinessProfileLink && !isValidUrl(data.shop.googleBusinessProfileLink)) {
      addError(errors, "shop.googleBusinessProfileLink", "Enter a valid Google Business Profile URL.");
    }
  }

  if (step === 2) {
    if (data.branding.mainBusinessPhone && !isValidPhone(data.branding.mainBusinessPhone)) {
      addError(errors, "branding.mainBusinessPhone", "Enter a valid business phone number.");
    }
    if (data.branding.replyToEmail && !isValidEmail(data.branding.replyToEmail)) {
      addError(errors, "branding.replyToEmail", "Enter a valid reply-to email.");
    }
  }

  if (step === 3) {
    if (data.setup.operatingModel !== "Owner only" && data.artists.length === 0) {
      addError(
        errors,
        "artists",
        "Add at least one artist for multi-artist, booth rental, or mixed shop models.",
      );
    }
    data.artists.forEach((artist, index) => validateArtist(index, artist, errors));
  }

  if (step === 4) {
    if (data.routing.primaryNotificationEmail && !isValidEmail(data.routing.primaryNotificationEmail)) {
      addError(errors, "routing.primaryNotificationEmail", "Enter a valid primary notification email.");
    }
    if (data.routing.primaryNotificationPhone && !isValidPhone(data.routing.primaryNotificationPhone)) {
      addError(errors, "routing.primaryNotificationPhone", "Enter a valid primary notification phone.");
    }
    if (
      data.routing.secondaryNotificationEmail &&
      !isValidEmail(data.routing.secondaryNotificationEmail)
    ) {
      addError(errors, "routing.secondaryNotificationEmail", "Enter a valid secondary notification email.");
    }
    if (
      data.routing.secondaryNotificationPhone &&
      !isValidPhone(data.routing.secondaryNotificationPhone)
    ) {
      addError(errors, "routing.secondaryNotificationPhone", "Enter a valid secondary notification phone.");
    }
  }

  if (step === 5) {
    data.artists.forEach((artist, index) => validateArtist(index, artist, errors));
  }

  if (step === 6) {
    return errors;
  }

  return errors;
}

export function validateAllSteps(data: OnboardingFormData) {
  const merged: ValidationErrors = {};

  for (const step of [1, 2, 3, 4, 5, 6]) {
    Object.assign(merged, validateStep(step, data));
  }

  return merged;
}

export function findFirstStepWithError(errors: ValidationErrors) {
  const keys = Object.keys(errors);

  if (keys.some((key) => key.startsWith("shop."))) return 1;
  if (keys.some((key) => key.startsWith("branding."))) return 2;
  if (keys.some((key) => key.startsWith("routing."))) return 4;
  if (
    keys.some(
      (key) =>
        key === "artists" ||
        key.endsWith(".fullName") ||
        key.endsWith(".email") ||
        key.endsWith(".mobileNumber") ||
        key.endsWith(".instagramProfile"),
    )
  ) {
    return 3;
  }
  if (
    keys.some(
      (key) =>
        key.includes("calendar") ||
        key.includes("booking") ||
        key.includes("existingBusinessNumber"),
    )
  ) {
    return 5;
  }

  return 1;
}
