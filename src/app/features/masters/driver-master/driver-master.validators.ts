
export interface FieldMeta {
  key: string;
  label: string;
  required?: boolean;
}

interface PatternRule {
  regex: RegExp;
  message: string;
}

const MOBILE: PatternRule = {
  regex: /^[6-9]\d{9}$/,
  message: 'Enter a valid 10-digit mobile number',
};

const PATTERNS: Record<string, PatternRule> = {
  contactNo: MOBILE,
  gpayNo: MOBILE,
  residenceContactNo: { regex: /^\d{10,11}$/, message: 'Enter a valid 10 or 11 digit number' },
  licenceNo: { regex: /^[A-Z]{2}\d{13}$/, message: 'Use 2 letters + 13 digits, e.g. KL6920200005276' },
  accountNo: { regex: /^\d{9,18}$/, message: 'Account number must be 9 to 18 digits' },
  ifscCode: { regex: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Enter a valid IFSC code, e.g. SBIN0007621' },
};

const DIGIT_KEYS = ['contactNo', 'residenceContactNo', 'gpayNo', 'accountNo'];

/** Trims everything, strips spaces/hyphens from numbers, and uppercases codes. */
export function normalizeValues(values: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) out[key] = (value ?? '').trim();

  for (const key of DIGIT_KEYS) {
    if (out[key]) out[key] = out[key].replace(/[\s-]/g, '');
  }
  if (out['licenceNo']) out['licenceNo'] = out['licenceNo'].replace(/[\s-]/g, '').toUpperCase();
  if (out['ifscCode']) out['ifscCode'] = out['ifscCode'].toUpperCase();
  return out;
}

/** Returns { fieldKey: message } for every invalid field (empty object = valid). */
export function validateDriver(
  values: Record<string, string>,
  fields: FieldMeta[],
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = values[field.key] ?? '';
    if (!value) {
      if (field.required) errors[field.key] = `${field.label} is required`;
      continue;
    }
    const rule = PATTERNS[field.key];
    if (rule && !rule.regex.test(value)) errors[field.key] = rule.message;
  }

  const { joinDate, licenceValidity } = values;
  // ISO dates (yyyy-mm-dd) compare correctly as strings.
  if (!errors['licenceValidity'] && joinDate && licenceValidity && licenceValidity < joinDate) {
    errors['licenceValidity'] = 'Licence validity cannot be before the join date';
  }

  return errors;
}