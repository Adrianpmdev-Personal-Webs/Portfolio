/**
 * Language
 *
 * Languages the portfolio is translated into; the first one is the default.
 *
 * @author adrianpmdev
 */

export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = SUPPORTED_LANGUAGES[0];

export function isLanguage(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}
