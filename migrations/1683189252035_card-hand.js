/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("card_hand", {
      id: "id",
      user_id: {
        type: "integer",
        notNull: true,
      },
      game_id: {
        type: "integer",
        notNull: true,
      },
      uno_card_id: {
        type: "integer",
        notNull: true,
      }
    });
  };
  
  /**
   * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
   */
  exports.down = (pgm) => {
    pgm.dropTable("card_hand");
  };