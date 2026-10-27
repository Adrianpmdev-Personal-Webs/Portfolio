/**
 * MinesweeperEngine
 *
 * Framework-agnostic Minesweeper logic: board generation, flood reveal, flags
 * and win/loss detection. The first click is never a mine.
 *
 * @author adrianpmdev
 */

import { MinesweeperCell } from './minesweeper-cell';

export class MinesweeperEngine {
  board: MinesweeperCell[][] = [];
  flagsLeft = 0;
  gameOver = false;
  win = false;
  started = false;

  private revealedSafeCells = 0;

  constructor(
    readonly rows = 9,
    readonly cols = 9,
    readonly mineCount = 10,
  ) {
    this.reset();
  }

  get finished(): boolean {
    return this.gameOver || this.win;
  }

  reset(): void {
    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })),
    );
    this.gameOver = false;
    this.win = false;
    this.started = false;
    this.flagsLeft = this.mineCount;
    this.revealedSafeCells = 0;
    this.placeMines();
    this.calculateAdjacents();
  }

  reveal(r: number, c: number): void {
    if (this.finished) return;
    const cell = this.board[r][c];
    if (cell.revealed || cell.flagged) return;

    if (!this.started) {
      this.started = true;
      if (cell.mine) {
        this.relocateMineFrom(r, c);
        this.calculateAdjacents();
      }
    }

    if (cell.mine) {
      cell.revealed = true;
      this.revealAllMines();
      this.gameOver = true;
      return;
    }

    this.revealFlood(r, c);
    this.checkWin();
  }

  toggleFlag(r: number, c: number): void {
    if (this.finished) return;
    const cell = this.board[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    this.flagsLeft += cell.flagged ? -1 : 1;
  }

  private placeMines(): void {
    let placed = 0;
    while (placed < this.mineCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (this.board[r][c].mine) continue;
      this.board[r][c].mine = true;
      placed++;
    }
  }

  private relocateMineFrom(r0: number, c0: number): void {
    this.board[r0][c0].mine = false;
    while (true) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.board[r][c].mine && (r !== r0 || c !== c0)) {
        this.board[r][c].mine = true;
        break;
      }
    }
  }

  private calculateAdjacents(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].mine) {
          this.board[r][c].adjacent = 0;
          continue;
        }
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if (this.board[nr][nc].mine) count++;
          }
        }
        this.board[r][c].adjacent = count;
      }
    }
  }

  private revealFlood(sr: number, sc: number): void {
    const stack: [number, number][] = [[sr, sc]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      const cell = this.board[r][c];
      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;
      if (!cell.mine) this.revealedSafeCells++;
      if (cell.adjacent !== 0) continue;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
          if (!this.board[nr][nc].revealed) stack.push([nr, nc]);
        }
      }
    }
  }

  private revealAllMines(): void {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.mine) cell.revealed = true;
      }
    }
  }

  private checkWin(): void {
    const safeCells = this.rows * this.cols - this.mineCount;
    if (this.revealedSafeCells === safeCells) {
      this.win = true;
    }
  }
}
