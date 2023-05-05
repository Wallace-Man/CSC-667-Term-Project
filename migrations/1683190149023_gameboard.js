/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("gameboard", {
      id: "id",
      clockwise: {
        type: "boolean",
        notNull: true,
        default: true,
      },
      game_id: {
        type: "integer",
        notNull: true,
      },
      uno_card_id: {
        type: "integer",
      },
    });
  };
  
  /**
   * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
   */
  exports.down = (pgm) => {
    pgm.dropTable("gameboard");
  };