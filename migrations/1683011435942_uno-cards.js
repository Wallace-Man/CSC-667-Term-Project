/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("uno_cards", {
      id: "id",
      card_color: {
        type: "integer",
        notNull: true,
      },
      card_number: {
        type: "integer",
        notNull: true,
      },
    });
  };
  
  /**
   * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
   */
  exports.down = (pgm) => {
    pgm.dropTable("uno_cards");
  };