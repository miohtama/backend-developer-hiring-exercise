

/**
 * An exception which error message is safe to echo back to the frontend.
 * 
 * Assume plain text helpful message for the API developer.
 */
export class APISafeException extends Error {
    constructor(msg) {
        super(msg);
    }
}