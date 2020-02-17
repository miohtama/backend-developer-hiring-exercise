

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


/**
 * Wrap class-validator exceptions to nicer readable format
 */
export class ValidationAPIException extends APISafeException {

    data: any;

    constructor(msg, data) {
        super(msg);
        this.data = data;
    }

    /**
     * Wrap the first user readabable error of many as the message.
     */
    static createFromValidationOutput(arrayOfValidationErrors) {

        /*
         ValidationError {
            target:
            User {
            displayName: 'strcxindg',
            pendingEmail: 'strincdgx',
            emailConfirmationRequestedAt: 2020-02-17T11:33:19.516Z },
            value: undefined,
            property: 'confirmedEmail',
            children: [],
            constraints: { isEmail: 'confirmedEmail must be an email' } },*/

        console.log(arrayOfValidationErrors);
        for(let error of arrayOfValidationErrors) {
            if(error.constraints) {
                for(let msg of Object.values(error.constraints)) {
                    return new this(msg, arrayOfValidationErrors);
                }
            }
        }
        let msg = "Unknown error";
        return new this(msg, arrayOfValidationErrors);
    }
}