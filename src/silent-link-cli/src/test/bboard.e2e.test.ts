import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../logger-utils.js';
import { currentDir, StandaloneConfig } from '../config.js';
import { LocalTestConfig, parseArgs, type TestConfig } from './commons.js';
import { type ChildProcessWithoutNullStreams } from 'node:child_process';

const FILE_NAME = fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);

const logDir = path.resolve(currentDir, '..', 'logs', 'tests', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

let testConfig: TestConfig;
let cliProcess: ChildProcessWithoutNullStreams;

describe('E2E BBoard CLI', () => {
  beforeAll(() => {
    if (process.env.RUN_ENV_TESTS === 'true') {
      testConfig = parseArgs(['seed', 'entry']);
    } else {
      testConfig = new LocalTestConfig();
    }
    logger.info(`Test environment: ${testConfig.entrypoint}`);
    logger.info(`Test wallet seed: ${testConfig.seed}`);
  });

  afterAll(() => {
    cliProcess?.kill('SIGINT');
  });

  it('should deploy the contract and interact [@slow]', async () => {
    const steps = [
      {
        input: 'Build wallet from a seed',
        answer: '2',
        condition: (nextInput: string) => {
          return nextInput.includes('Enter your wallet seed');
        },
      },
      {
        input: 'Enter your wallet seed',
        answer: testConfig.seed,
        condition: (nextInput: string) => {
          return nextInput.includes('Your wallet balance is');
        },
      },
      {
        input: 'Deploy a new bulletin board contract',
        answer: '1',
        condition: (nextInput: string) => {
          return nextInput.includes('deployContract');
        },
      },
      {
        input: 'Display the current ledger state',
        answer: '3',
        condition: (nextInput: string) => {
          return nextInput.includes("Current message is: 'none'");
        },
      },
      {
        input: 'Post a message',
        answer: '1',
        condition: (nextInput: string) => {
          return nextInput.includes('');
        },
      },
      {
        input: 'What message do you want to post?',
        answer: 'TESTNOTE!',
        condition: (nextInput: string) => {
          return nextInput.includes('postingMessage');
        },
      },
      {
        input: 'Display the current private state (known only to this DApp instance)',
        answer: '4',
        condition: (nextInput: string) => {
          return nextInput.includes('Current secret key is');
        },
      },
      {
        input: 'Display the current ledger state',
        answer: '3',
        condition: (nextInput: string) => {
          return nextInput.includes("Current message is: 'TESTNOTE!'");
        },
      },
      {
        input: 'Take down your message',
        answer: '2',
        condition: (nextInput: string) => {
          return nextInput.includes('takingDownMessage');
        },
      },
      {
        input: 'Display the current ledger state',
        answer: '3',
        condition: (nextInput: string) => {
          return nextInput.includes("Current message is: 'none'");
        },
      },
      {
        input: 'Exit',
        answer: '6',
        condition: (nextInput: string) => {
          return nextInput.includes('Goodbye');
        },
      },
      {
        input: 'CLI goodbye message',
        answer: '',
      },
    ];

    let progressCondition: ((input: string) => boolean) | undefined;

    cliProcess = spawn('npx', ['ts-node', '--esm', '--experimental-specifier-resolution=node', testConfig.entrypoint], {
      cwd: DIR_NAME,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const promise = new Promise<void>((resolve: (value: PromiseLike<void> | void) => void) => {
      let thinkingTime = 5000;
      if (testConfig.dappConfig instanceof StandaloneConfig) {
        // There is a skip of asking for wallet in this scenario
        steps.shift();
        steps.shift();
        thinkingTime = 2000;
      }
      let step = steps.shift();
      cliProcess?.stdout?.on('data', (data: Buffer) => {
        logger.info(`STEP[Wait for input='${step?.input}', to answer='${step?.answer}']`);
        const output = data.toString();
        logger.info(`[CONSOLE] ${output}`);
        expect(output).not.toContain('ERROR');
        if (progressCondition !== undefined && progressCondition(output)) {
          step = steps.shift();
          progressCondition = undefined;
        }
        if (steps.length === 0) {
          resolve();
        }
        if (step !== undefined && output.includes(step.input)) {
          if (step.answer !== undefined) {
            logger.info(`Thinking and typing... ${step?.answer}`);
            setTimeout(() => {
              cliProcess?.stdin?.write(`${step?.answer}\n`);
            }, thinkingTime);
          }
          progressCondition = step.condition;
          logger.info(
            `Will progress to next step on condition: ${progressCondition?.toString().replaceAll(/\s+/g, ' ')}`,
          );
        }
      });
      const errorListener = (err: string) => {
        resolve(Promise.reject(err.toString()));
      };
      const terminateListener = (code: number) => {
        cliProcess?.kill('SIGKILL');
        resolve();
        expect(code).toBe(0);
      };
      cliProcess?.stderr?.on('data', errorListener);
      cliProcess?.on('error', errorListener);
      cliProcess?.on('exit', terminateListener);
      cliProcess?.on('disconnect', terminateListener);
    });
    await expect(promise).resolves.toBeUndefined();
  });
});
