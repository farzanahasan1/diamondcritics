// ── Spam word filter ────────────────────────────────────────────────────────
const SPAM_PATTERNS = [
  // Crypto / get-rich-quick
  /\bcrypto\s*giveaway\b/i,
  /\bfree\s+bitcoin\b/i,
  /\bmake\s+money\s+fast\b/i,
  /\bwork\s+from\s+home.{0,20}earn\b/i,
  /\b\$\d+\s*per\s*(day|hour|week)\b/i,
  // Casino / gambling
  /\bonline\s+casino\b/i,
  /\bslot\s+machine\b/i,
  /\bsports\s*betting\b/i,
  // Phishing / scam
  /\bclick\s+here\s+to\s+win\b/i,
  /\byou\s+have\s+been\s+selected\b/i,
  /\bcongratulations.{0,30}won\b/i,
  /\bverify\s+your\s+(account|wallet)\b/i,
  // Competitor spam (fill in real competitors if needed)
  /\bvisit\s+our\s+site\s+for\b/i,
  // Adult content signals
  /\b(xxx|porn|nude|naked).{0,10}diamond\b/i,
]

const SPAM_WORDS = [
  'whatsapp me', 'telegram me', 'dm me for price',
  'best price guaranteed click', 'limited time offer click',
]

export function containsSpam(text: string): boolean {
  const lower = text.toLowerCase()
  if (SPAM_WORDS.some(w => lower.includes(w))) return true
  if (SPAM_PATTERNS.some(p => p.test(text))) return true
  // Excessive URLs (3+ http links = likely spam)
  const urlCount = (text.match(/https?:\/\//gi) ?? []).length
  if (urlCount >= 3) return true
  return false
}

// ── Disposable email domains ──────────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwam.com',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'spam4.me', 'trashmail.com', 'trashmail.me',
  'dispostable.com', 'spamgourmet.com', 'getairmail.com', 'fakeinbox.com',
  'maildrop.cc', 'spamex.com', 'mailnull.com', 'discard.email',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'mohmal.com',
  'temp-mail.org', 'tempmail.net', 'burnermail.io', 'throwaway.email',
  'trashmail.at', 'trashmail.io', 'getnada.com', 'mailtemp.info',
  'emailondeck.com', 'filzmail.com', 'mytemp.email', 'spamhereplease.com',
  'cmail.club', 'chacuo.net', '33mail.com', 'spamfree24.org',
  'dispostable.com', 'mailnesia.com', 'mailnew.com', 'mailsac.com',
  'spamgrap.com', 'trashmail.net', 'mt2015.com', 'mt2014.com',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
}

// ── Report reasons ────────────────────────────────────────────────────────────
export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or self-promotion' },
  { value: 'harassment', label: 'Harassment or hate' },
  { value: 'misinformation', label: 'Misleading information' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Other' },
] as const

export type ReportReason = typeof REPORT_REASONS[number]['value']

