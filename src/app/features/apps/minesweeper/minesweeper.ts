/**
 * Minesweeper
 *
 * Minesweeper app view over MinesweeperEngine: handles clicks, touch
 * long-press flagging and the timer.
 *
 * @author adrianpmdev
 */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MinesweeperCell } from './minesweeper-cell';
import { MinesweeperEngine } from './minesweeper-engine';

const LONG_PRESS_MS = 420;
const MAX_TIMER = 999;

interface MinesweeperView {
  board: MinesweeperCell[][];
  flagsLeft: number;
  gameOver: boolean;
  win: boolean;
}

@Component({
  selector: 'app-minesweeper',
  imports: [TranslatePipe],
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Minesweeper {
  private readonly game = new MinesweeperEngine();

  protected readonly view = signal<MinesweeperView>(this.snapshot());
  protected readonly timer = signal(0);
  protected readonly formattedTimer = computed(() => String(this.timer()).padStart(3, '0'));
  protected readonly face = computed(() => {
    if (this.view().gameOver) return '😵';
    if (this.view().win) return '😎';
    return '🙂';
  });

  private timerId: ReturnType<typeof setInterval> | undefined;
  private longPressTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private longPressTriggered = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.stopTimer();
      this.clearLongPress();
    });
  }

  protected newGame(): void {
    this.game.reset();
    this.stopTimer();
    this.timer.set(0);
    this.refresh();
  }

  protected revealCell(r: number, c: number): void {
    const wasStarted = this.game.started;
    this.game.reveal(r, c);

    if (!wasStarted && this.game.started) this.startTimer();
    if (this.game.finished) this.stopTimer();
    this.refresh();
  }

  protected flagCell(event: MouseEvent, r: number, c: number): void {
    event.preventDefault();
    this.toggleFlag(r, c);
  }

  protected startLongPress(event: TouchEvent, r: number, c: number): void {
    event.preventDefault();
    this.longPressTriggered = false;
    this.clearLongPress();
    this.longPressTimeoutId = setTimeout(() => {
      this.longPressTriggered = true;
      this.toggleFlag(r, c);
      navigator.vibrate?.(15);
    }, LONG_PRESS_MS);
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

  protected cellText(cell: MinesweeperCell): string {
    if (!cell.revealed) return cell.flagged ? '🚩' : '';
    if (cell.mine) return '💣';
    return cell.adjacent > 0 ? String(cell.adjacent) : '';
  }

  private toggleFlag(r: number, c: number): void {
    this.game.toggleFlag(r, c);
    this.refresh();
  }

  private refresh(): void {
    this.view.set(this.snapshot());
  }

  private snapshot(): MinesweeperView {
    return {
      board: this.game.board.map((row) => row.map((cell) => ({ ...cell }))),
      flagsLeft: this.game.flagsLeft,
      gameOver: this.game.gameOver,
      win: this.game.win,
    };
  }

  private clearLongPress(): void {
    clearTimeout(this.longPressTimeoutId);
    this.longPressTimeoutId = undefined;
  }

  private startTimer(): void {
    if (this.timerId) return;
    this.timerId = setInterval(() => this.timer.update((t) => Math.min(MAX_TIMER, t + 1)), 1000);
  }

  private stopTimer(): void {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }
}
