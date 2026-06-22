/**
 * @typedef {'Lodged'|'Under Review'|'Decision Pending'|'Decided'} VisaStatus
 * @typedef {'granted'|'refused'} VisaOutcome
 * @typedef {'Financial Documents'|'English Proficiency'|'Purpose of Study'|'Genuineness'|'Sponsor Issues'|'Other'} RefusalCategory
 *
 * @typedef {Object} Case
 * @property {string} id
 * @property {string} studentId
 * @property {string} counsellorId
 * @property {string} country
 * @property {string} intake
 * @property {string} stage        One of pipeline stage ids
 * @property {string} nextAction
 * @property {string} deadline     ISO date
 * @property {string} blocker
 * @property {string} lastContact  ISO date
 * @property {VisaStatus|null} visaStatus
 * @property {VisaOutcome|null} visaOutcome
 * @property {RefusalCategory|null} refusalCategory
 * @property {string|null} refusalDetail
 */
export {};
