/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("game_users", {
      user_id: {
        type: "integer",
        notNull: true,
      },
      game_id: {
        type: "integer",
        notNull: true,
      },
      current_player: {
        type: "boolean",
        default: false,
      },
    });
  };
  
  /**
   * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
   */
  exports.down = (pgm) => {
    pgm.dropTable("game_users");
  };