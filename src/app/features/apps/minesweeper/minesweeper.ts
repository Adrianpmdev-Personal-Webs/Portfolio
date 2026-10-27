/**
 * Minesweeper
 *
 * Minesweeper app view over MinesweeperEngine: handles clicks, touch
 * long-press flagging and the timer.
 *
 * @author adrianpmdev
 */

import { Component, OnDestroy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MinesweeperCell } from './minesweeper-cell';
import { MinesweeperEngine } from './minesweeper-engine';

@Component({
  selector: 'app-minesweeper',
  imports: [TranslatePipe],
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.scss',
})
export class Minesweeper implements OnDestroy {
  private static readonly LONG_PRESS_MS = 420;

  protected readonly game = new MinesweeperEngine();
  protected timer = 0;

  private timerId: number | undefined;
  private longPressTimeoutId: number | undefined;
  private longPressTriggered = false;

  ngOnDestroy(): void {
    this.stopTimer();
    this.clearLongPress();
  }

  protected newGame(): void {
    this.game.reset();
    this.timer = 0;
    this.stopTimer();
  }

  protected revealCell(r: number, c: number): void {
    const wasStarted = this.game.started;
    this.game.reveal(r, c);

    if (!wasStarted && this.game.started) this.startTimer();
    if (this.game.finished) this.stopTimer();
  }

  protected flagCell(event: MouseEvent, r: number, c: number): void {
    event.preventDefault();
    this.game.toggleFlag(r, c);
  }

  protected startLongPress(event: TouchEvent, r: number, c: number): void {
    event.preventDefault();
    this.longPressTriggered = false;
    this.clearLongPress();
    this.longPressTimeoutId = window.setTimeout(() => {
      this.longPressTriggered = true;
      this.game.toggleFlag(r, c);
      if (navigator.vibrate) navigator.vibrate(15);
    }, Minesweeper.LONG_PRESS_MS);
  }

  protected endLongPress(event: TouchEvent, r: number, c: number): void {
    event.preventDefault();
    this.clearLongPress();
    if (this.longPressTriggered) {
      this.longPressTriggered = false;
      return;
    }
    this.revealCell(r, c);
  }

  protected cancelLongPress(): void {
    this.clearLongPress();
  }

  protected face(): string {
    if (this.game.gameOver) return '😵';
    if (this.game.win) return '😎';
    return '🙂';
  }

  protected cellText(cell: MinesweeperCell): string {
    if (!cell.revealed) return cell.flagged ? '🚩' : '';
    if (cell.mine) return '💣';
    return cell.adjacent > 0 ? String(cell.adjacent) : '';
  }

  protected get formattedTimer(): string {
    return String(this.timer).padStart(3, '0');
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
}
