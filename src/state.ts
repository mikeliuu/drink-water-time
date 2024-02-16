'use strict';

import { Memento } from 'vscode';

export const STATE_KEY = {
  status: 'drink-water-time.status',
  intervalInMintue: 'drink-water-time.intervalInMintue',
  reminderText: 'drink-water-time.reminderText',
};

export type State = {
  status: boolean;
  intervalInMintue: number;
  reminderText: string;
};

export const defaultState: State = {
  status: false,
  intervalInMintue: 15,
  reminderText: "Hey, it's time to drink water! 💦",
};

export class StateService {
  constructor(private state: Memento) {}

  public get<T>(key: string, defaultValue?: T): T {
    return this.state.get<T>(key, defaultValue!);
  }

  public update<T>(key: string, value: T) {
    this.state.update(key, value);
  }

  public init<T>(keys: Record<string, string>, defaultState: T) {
    Object.entries(keys).forEach(([name, key]) => {
      this.state.update(key, defaultState[name as keyof T]);
    });
  }
}
