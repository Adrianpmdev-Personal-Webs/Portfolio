import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MinesweeperCell } from '../../core/models/minesweeper-cell.model';

/**
 * Aplicación "Buscaminas": ventana del escritorio con una implementación
 * completa del clásico Buscaminas de Windows (tablero, banderas,
 * temporizador y detección de victoria/derrota). En dispositivos táctiles,
 * una pulsación larga sobre una celda equivale al clic derecho de escritorio
 * para poner o quitar una bandera.
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './minesweeper.component.html',
  styleUrl: './minesweeper.component.scss',
})
export class MinesweeperComponent implements OnInit {
  private static readonly ROWS = 9;
  private static readonly COLS = 9;
  private static readonly MINE_COUNT = 10;

  /** Duración en ms de la pulsación larga táctil que equivale al clic derecho de escritorio. */
  private static readonly LONG_PRESS_MS = 420;

  private readonly rows = MinesweeperComponent.ROWS;
  private readonly cols = MinesweeperComponent.COLS;
  private readonly mineCount = MinesweeperComponent.MINE_COUNT;

  board: MinesweeperCell[][] = [];
  gameOver = false;
  win = false;
  flagsLeft = this.mineCount;
  timer = 0;

  private firstClickDone = false;
  private revealedSafeCells = 0;
  private timerId: number | undefined;

  private longPressTimeoutId: number | undefined;
  private longPressTriggered = false;

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      }))
    );
    this.gameOver = false;
    this.win = false;
    this.firstClickDone = false;
    this.flagsLeft = this.mineCount;
    this.revealedSafeCells = 0;
    this.timer = 0;
    this.stopTimer();
    this.placeMines();
    this.calculateAdjacents();
  }

  onCellLeftClick(r: number, c: number): void {
    if (this.gameOver || this.win) return;
    const cell = this.board[r][c];
    if (cell.revealed || cell.flagged) return;

    if (!this.firstClickDone) {
      this.firstClickDone = true;
      this.startTimer();
      if (cell.mine) {
        this.relocateMineFrom(r, c);
        this.calculateAdjacents();
      }
    }

    if (cell.mine) {
      cell.revealed = true;
      this.revealAllMines();
      this.stopTimer();
      this.gameOver = true;
      return;
    }

    this.revealFlood(r, c);
    this.checkWin();
  }

  onCellRightClick(event: MouseEvent, r: number, c: number): void {
    event.preventDefault();
    this.toggleFlag(r, c);
  }

  /**
   * Inicia el temporizador de pulsación larga en touchstart. Si el dedo
   * se mantiene sin moverse el tiempo suficiente, equivale al clic derecho
   * (poner/quitar bandera) sin llegar a revelar la celda.
   */
  onCellTouchStart(event: TouchEvent, r: number, c: number): void {
    event.preventDefault();
    this.longPressTriggered = false;
    this.clearLongPress();
    this.longPressTimeoutId = window.setTimeout(() => {
      this.longPressTriggered = true;
      this.toggleFlag(r, c);
      if (navigator.vibrate) navigator.vibrate(15);
    }, MinesweeperComponent.LONG_PRESS_MS);
  }

  onCellTouchEnd(event: TouchEvent, r: number, c: number): void {
    event.preventDefault();
    this.clearLongPress();
    if (this.longPressTriggered) {
      this.longPressTriggered = false;
      return;
    }
    this.onCellLeftClick(r, c);
  }

  onCellTouchMove(): void {
    this.clearLongPress();
  }

  face(): string {
    if (this.gameOver) return '😵';
    if (this.win) return '😎';
    return '🙂';
  }

  cellText(cell: MinesweeperCell): string {
    if (!cell.revealed) return cell.flagged ? '🚩' : '';
    if (cell.mine) return '💣';
    return cell.adjacent > 0 ? String(cell.adjacent) : '';
  }

  get formattedTimer(): string {
    return String(this.timer).padStart(3, '0');
  }

  private toggleFlag(r: number, c: number): void {
    if (this.gameOver || this.win) return;
    const cell = this.board[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    this.flagsLeft += cell.flagged ? -1 : 1;
  }

  private clearLongPress(): void {
    if (this.longPressTimeoutId) {
      clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = undefined;
    }
  }

  private startTimer(): void {
    if (this.timerId) return;
    this.timerId = window.setInterval(() => {
      if (this.timer < 999) this.timer++;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
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
    const stack: Array<[number, number]> = [[sr, sc]];
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
      this.stopTimer();
    }
  }
}
