/**
 * @typedef {'user'|'assistant'} MessageRole
 */

/**
 * @typedef {Object} AskAction
 * @property {string} label
 * @property {string} path
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {MessageRole} role
 * @property {string} text
 * @property {string[]} [followUps]
 * @property {AskAction[]} [actions]
 */

/**
 * @typedef {Object} AskResponse
 * @property {string} answer
 * @property {string[]} followUps
 * @property {AskAction[]} [actions]
 */

export {};
