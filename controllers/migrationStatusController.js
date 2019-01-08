module.exports = class MigrationStatus extends Abstract {
    constructor(schema) {
      super(schema);
    }
    static get name() {
        return "migrationStatus";
      }
}