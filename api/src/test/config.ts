import path from 'node:path';
import {
  networkId,
  setNetworkId,
  toLedgerNetworkId,
  toRuntimeNetworkId,
  toZswapNetworkId,
} from '@midnight-ntwrk/midnight-js-network-id';
import * as zswap from '@midnight-ntwrk/zswap';
import * as runtime from '@midnight-ntwrk/compact-runtime';
import * as ledger from '@midnight-ntwrk/ledger';

export interface Config {
  readonly privateStateStoreName: string;
  readonly logDir: string;
  readonly zkConfigPath: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;
}

export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');

export class DevnetLocalConfig implements Config {
  privateStateStoreName = 'bboard-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'devnet-local', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', '..', 'contract', 'dist', 'managed', 'bboard');
  indexer = 'http://127.0.0.1:8088/api/v1/graphql';
  indexerWS = 'ws://127.0.0.1:8088/api/v1/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';

  constructor() {
    const theNetworkId = networkId.devnet;
    setNetworkId(theNetworkId);
    zswap.setNetworkId(toZswapNetworkId(theNetworkId));
    runtime.setNetworkId(toRuntimeNetworkId(theNetworkId));
    ledger.setNetworkId(toLedgerNetworkId(theNetworkId));
  }
}

export class StandaloneConfig implements Config {
  privateStateStoreName = 'bboard-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'standalone', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', '..', 'contract', 'dist', 'managed', 'bboard');
  indexer = 'http://127.0.0.1:8088/api/v1/graphql';
  indexerWS = 'ws://127.0.0.1:8088/api/v1/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';

  constructor() {
    const theNetworkId = networkId.undeployed;
    setNetworkId(theNetworkId);
    zswap.setNetworkId(toZswapNetworkId(theNetworkId));
    runtime.setNetworkId(toRuntimeNetworkId(theNetworkId));
    ledger.setNetworkId(toLedgerNetworkId(theNetworkId));
  }
}

export class AriadneQaRemoteConfig implements Config {
  privateStateStoreName = 'bboard-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'ariadne-qa-remote', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', '..', 'contract', 'dist', 'managed', 'bboard');
  indexer = 'https://indexer.ariadne-qa.dev.midnight.network/api/v1/graphql';
  indexerWS = 'wss://indexer.ariadne-qa.dev.midnight.network/api/v1/graphql/ws';
  node = 'https://rpc.ariadne-qa.dev.midnight.network';
  proofServer = 'http://127.0.0.1:6300';

  constructor() {
    const theNetworkId = networkId.devnet;
    setNetworkId(theNetworkId);
    zswap.setNetworkId(toZswapNetworkId(theNetworkId));
    runtime.setNetworkId(toRuntimeNetworkId(theNetworkId));
    ledger.setNetworkId(toLedgerNetworkId(theNetworkId));
  }
}

export class DevnetRemoteConfig implements Config {
  privateStateStoreName = 'bboard-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'devnet-remote', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', '..', 'contract', 'dist', 'managed', 'bboard');
  indexer = 'https://indexer.devnet.midnight.network/api/v1/graphql';
  indexerWS = 'wss://indexer.devnet.midnight.network/api/v1/graphql/ws';
  node = 'https://rpc.devnet.midnight.network';
  proofServer = 'http://127.0.0.1:6300';

  constructor() {
    const theNetworkId = networkId.devnet;
    setNetworkId(theNetworkId);
    zswap.setNetworkId(toZswapNetworkId(theNetworkId));
    runtime.setNetworkId(toRuntimeNetworkId(theNetworkId));
    ledger.setNetworkId(toLedgerNetworkId(theNetworkId));
  }
}
