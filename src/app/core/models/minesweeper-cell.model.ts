/**
 * Estado de una celda individual del tablero del Buscaminas.
 *
 * @author adrianpmdev
 */
export interface MinesweeperCell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}
