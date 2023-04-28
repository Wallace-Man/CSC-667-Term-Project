/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("games", {
      id: "id",
      closed: {
        type: "boolean",
        default: false,
      },
      title:{
        type: "varchar(100)",
        notNull: true,
      },
      number_of_players: {
        type: "integer",
        notNull: true,
      }
    });
  };
  
  /**
   * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
   */
  exports.down = (pgm) => {
    pgm.dropTable("games");
  };