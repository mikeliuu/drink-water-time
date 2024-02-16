'use strict';

import * as vscode from 'vscode';
import { State } from './state';

const MS_TO_MINUTE = 60_000;

export class Timer {
  private state: State;
  private timeout: number;

  constructor(state: State, timeout = MS_TO_MINUTE) {
    this.state = state;
    this.timeout = timeout;
  }

  public start(callback?: () => void) {
    const intervalId = setInterval(() => {
      if (!this.state.status) {
        clearInterval(intervalId);
        return;
      }

      vscode.window.showInformationMessage(this.state.reminderText);

      if (callback) callback();
    }, this.state.intervalInMintue * this.timeout);
  }
}
