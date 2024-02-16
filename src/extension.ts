'use strict';

import * as vscode from 'vscode';
import { STATE_KEY, StateService, defaultState } from './state';
import { getIntervalInMintueInput, getReminderTextInput } from './input';
import { Timer } from './timer';

export function activate(context: vscode.ExtensionContext) {
  const state = new StateService(context.globalState);

  state.init(STATE_KEY, defaultState);

  const intervalInMintue = state.get<number>(STATE_KEY.intervalInMintue);
  const reminderText = state.get<string>(STATE_KEY.reminderText);

  async function startReminderCommand() {
    const minuteInput = await getIntervalInMintueInput(intervalInMintue);
    const reminderTextInput = await getReminderTextInput(reminderText);

    state.update(STATE_KEY.status, true);
    state.update(STATE_KEY.intervalInMintue, minuteInput);
    state.update(STATE_KEY.reminderText, reminderTextInput);

    const status = state.get<boolean>(STATE_KEY.status);

    const minute = `minute${minuteInput > 1 ? 's' : ''}`;

    vscode.window.showInformationMessage(
      `Drink Water Time: Reminding you to drink water every ${minuteInput} ${minute}`,
    );

    const reminder = new Timer({
      status,
      intervalInMintue: minuteInput,
      reminderText: reminderTextInput,
    });

    reminder.start();
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `drink-water-time.start`,
      startReminderCommand,
    ),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage(
    'Drink Water Time is now disabled\n Bear in mind, water keeps your skin healthy, ensures proper kidney functioning, and increases productivity. Seya!',
  );
}
