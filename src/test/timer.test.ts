import * as assert from 'assert';
import * as vscode from 'vscode';
import sinon from 'sinon';
import { Timer } from '../timer';
import { State } from '../state';

const mockTimeout = 60_000;

type TestCasePayload = {
  testName: string;
  state: State;
  clockTick: number;
  expected: boolean;
};

class StateGenerator {
  private state: State = {
    status: false,
    intervalInMintue: 1,
    reminderText: 'reminder',
  };

  constructor(state?: State) {
    if (state) {
      this.state = state;
    }
  }

  public status(value: boolean) {
    return new StateGenerator({ ...this.state, status: value });
  }

  public intervalInMintue(value: number) {
    return new StateGenerator({ ...this.state, intervalInMintue: value });
  }

  public reminderText(value: string) {
    return new StateGenerator({ ...this.state, reminderText: value });
  }

  public generate() {
    return this.state;
  }
}

function generateTestCase(testCases: TestCasePayload[]) {
  testCases.forEach(({ testName, state, clockTick, expected }) => {
    test(testName, () => {
      const clock = sinon.useFakeTimers();
      const callback = sinon.spy();

      const reminder = new Timer(
        {
          status: state.status,
          intervalInMintue: state.intervalInMintue,
          reminderText: state.reminderText,
        },
        mockTimeout,
      );

      reminder.start(callback);

      clock.tick(clockTick);

      assert.strictEqual(callback.calledOnce, expected);

      clock.restore();
    });
  });
}

suite('Timer tests', () => {
  vscode.window.showInformationMessage('Start timer tests.');

  const defaultState = new StateGenerator();

  generateTestCase([
    {
      testName: 'should not run timer: status = FALSE',
      state: defaultState.generate(),
      clockTick: mockTimeout,
      expected: false,
    },
    {
      testName: 'should run timer: status = TRUE',
      state: defaultState.status(true).generate(),
      clockTick: mockTimeout,
      expected: true,
    },
    {
      testName:
        'should run timer with inaccurate interval: status = TRUE, inaccurate interval',
      state: defaultState.status(true).intervalInMintue(15).generate(),
      clockTick: mockTimeout,
      expected: false,
    },
    {
      testName:
        'should run timer with accurate interval: status = TRUE, accurate interval',
      state: defaultState.status(true).intervalInMintue(15).generate(),
      clockTick: 15 * mockTimeout,
      expected: true,
    },
  ]);
});
