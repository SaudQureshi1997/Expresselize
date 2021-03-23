export default class ValidationException extends Error {
    /**
     * @param {Object} errors 
     */
    constructor(errors) {
        super("Invalid Input");
        this.code = 422;
        this.errors = errors;
    }
}