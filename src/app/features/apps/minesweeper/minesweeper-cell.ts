/**
 * MinesweeperCell
 *
 * State of a single Minesweeper board cell.
 *
 * @author adrianpmdev
 */

export interface MinesweeperCell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}
