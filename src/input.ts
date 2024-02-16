'use strict';

import * as vscode from 'vscode';

export async function getIntervalInMintueInput(
  intervalInMintue: number,
): Promise<number> {
  const result = await vscode.window.showInputBox({
    value: '',
    placeHolder: `${intervalInMintue}m (by default)`,
    prompt: 'How often do you want a water reminder?',
    validateInput: text => {
      /**
       * example: 15m
       */
      const regex = /\d+\m/g;

      // valid if empty value OR matches regex
      return text === '' || !!text.match(regex)?.length
        ? null
        : 'Please follow in the format: <minute>m, for example: 15m';
    },
  });

  return !result ? intervalInMintue : parseInt(result);
}

export async function getReminderTextInput(
  reminderText: string,
): Promise<string> {
  const result = await vscode.window.showInputBox({
    value: reminderText,
    placeHolder: reminderText,
    prompt: 'What would you like the reminder text to say?',
    validateInput: text => {
      // valid if empty value OR matches regex
      return text !== '' ? null : 'Please set a water reminder text';
    },
  });

  return !result ? reminderText : result;
}
