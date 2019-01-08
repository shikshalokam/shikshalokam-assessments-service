module.exports = class Version extends Abstract {
    constructor(schema) {
      super(schema);
    }
    static get name() {
        return "version";
      }
}