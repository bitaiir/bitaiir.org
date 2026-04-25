/**
 * Reference data for the JSON-RPC methods exposed by `bitaiird` and the
 * matching `bitaiir-cli` subcommands. Mirrors the trait in
 * `bitaiir-rpc/src/lib.rs` of the core repo. When the core's RPC surface
 * changes, update this file in the same PR that documents the change.
 */

export const RPC_GROUPS = [
  'chain',
  'wallet',
  'mining',
  'peers',
  'aliases',
  'escrow',
  'daemon',
] as const;
export type RpcGroup = (typeof RPC_GROUPS)[number];

export type RpcParam = {
  name: string;
  type: string;
  required: boolean;
};

export type RpcCommand = {
  /** JSON-RPC method name on the wire (e.g. `sendtoaddress`). */
  name: string;
  group: RpcGroup;
  /** Human-readable signature used as the section heading on the page. */
  signature: string;
  description: { en: string; 'pt-br': string };
  params: RpcParam[];
  /** A representative `bitaiir-cli` invocation. */
  cliExample: string;
  /** A representative response — pretty-printed JSON or the literal string the daemon returns. */
  responseExample: string;
};

export const RPC_COMMANDS: RpcCommand[] = [
  // ───────────────────────── Chain ─────────────────────────
  {
    name: 'getblockchaininfo',
    group: 'chain',
    signature: 'getblockchaininfo',
    description: {
      en: 'Returns chain height, tip hash, total UTXO count, current difficulty target, and the next block subsidy.',
      'pt-br': 'Retorna altura da cadeia, hash do tip, total de UTXOs, target de dificuldade atual e o próximo subsídio de bloco.',
    },
    params: [],
    cliExample: 'bitaiir-cli getblockchaininfo',
    responseExample: `{
  "height": 12345,
  "tip_hash": "8c25dd...e409",
  "utxo_count": 4287,
  "next_subsidy": "100 AIIR",
  "bits": "0x1d00ffff"
}`,
  },
  {
    name: 'getblock',
    group: 'chain',
    signature: 'getblock <height>',
    description: {
      en: 'Fetches a block by its height. Returns header fields, transaction count, and the list of transaction IDs.',
      'pt-br': 'Busca um bloco pela altura. Retorna os campos do cabeçalho, contagem de transações e a lista de txids.',
    },
    params: [{ name: 'height', type: 'u64', required: true }],
    cliExample: 'bitaiir-cli getblock 100',
    responseExample: `{
  "height": 100,
  "hash": "8c25dd...e409",
  "prev_block_hash": "95ced1...4e70",
  "merkle_root": "a14ef0...c2b1",
  "timestamp": 1746230400,
  "bits": "0x1d00ffff",
  "nonce": 327,
  "tx_count": 2,
  "txids": ["5cbe93...", "f1a8c2..."]
}`,
  },
  {
    name: 'gettransaction',
    group: 'chain',
    signature: 'gettransaction <txid>',
    description: {
      en: 'Looks up a transaction by its hex-encoded txid. Checks the mempool first (0 confirmations), then scans the chain backwards.',
      'pt-br': 'Busca uma transação pelo txid em hex. Olha primeiro no mempool (0 confirmações) e depois varre a cadeia de trás para frente.',
    },
    params: [{ name: 'txid', type: 'string (hex)', required: true }],
    cliExample: 'bitaiir-cli gettransaction 5cbe93f1a8c2...',
    responseExample: `{
  "txid": "5cbe93...",
  "confirmations": 6,
  "block_height": 12340,
  "inputs": [{ "prev_out": "...", "amount": 1.0 }],
  "outputs": [{ "address": "aiir1KXg...", "amount": 1.0 }]
}`,
  },
  {
    name: 'getmempoolinfo',
    group: 'chain',
    signature: 'getmempoolinfo',
    description: {
      en: 'Returns the number of transactions currently in the mempool and the total bytes they occupy.',
      'pt-br': 'Retorna o número de transações atualmente no mempool e quantos bytes elas ocupam.',
    },
    params: [],
    cliExample: 'bitaiir-cli getmempoolinfo',
    responseExample: `{
  "tx_count": 17,
  "bytes": 4218
}`,
  },

  // ───────────────────────── Wallet ─────────────────────────
  {
    name: 'getnewaddress',
    group: 'wallet',
    signature: 'getnewaddress',
    description: {
      en: 'Generates a new BitAiir address. When the wallet has an HD seed, the address is derived along the BIP44 path; otherwise a random key is created and persisted.',
      'pt-br': 'Gera um novo endereço BitAiir. Se a carteira tem seed HD, o endereço é derivado pelo caminho BIP44; caso contrário, gera uma chave aleatória e a persiste.',
    },
    params: [],
    cliExample: 'bitaiir-cli getnewaddress',
    responseExample: `"aiir1KXgUaSrv31thw41QTrb3MpK9FBziQQZ8T"`,
  },
  {
    name: 'getbalance',
    group: 'wallet',
    signature: 'getbalance <address>',
    description: {
      en: 'Returns the spendable balance of an address (mature, unspent outputs in the UTXO set).',
      'pt-br': 'Retorna o saldo gastável de um endereço (saídas maduras e não gastas no conjunto de UTXOs).',
    },
    params: [{ name: 'address', type: 'string', required: true }],
    cliExample: 'bitaiir-cli getbalance aiir1KXgUaSrv31thw41QTrb3MpK9FBziQQZ8T',
    responseExample: `{
  "address": "aiir1KXg...",
  "spendable": "12.50000000 AIIR",
  "pending": "0.00000000 AIIR",
  "immature": "100.00000000 AIIR"
}`,
  },
  {
    name: 'listaddresses',
    group: 'wallet',
    signature: 'listaddresses',
    description: {
      en: 'Lists every address in the wallet with its current balance.',
      'pt-br': 'Lista todos os endereços da carteira com o saldo atual de cada um.',
    },
    params: [],
    cliExample: 'bitaiir-cli listaddresses',
    responseExample: `[
  { "address": "aiir1KXg...", "balance": "12.50 AIIR" },
  { "address": "aiir1abc...", "balance": "0.00 AIIR" }
]`,
  },
  {
    name: 'gettransactionhistory',
    group: 'wallet',
    signature: 'gettransactionhistory <address>',
    description: {
      en: 'Lists every transaction involving an address (sent and received), in reverse chronological order.',
      'pt-br': 'Lista todas as transações envolvendo um endereço (enviadas e recebidas) em ordem cronológica inversa.',
    },
    params: [{ name: 'address', type: 'string', required: true }],
    cliExample: 'bitaiir-cli gettransactionhistory aiir1KXgUaSrv31thw41QTrb3MpK9FBziQQZ8T',
    responseExample: `[
  { "txid": "5cbe93...", "direction": "received", "amount": "10.00 AIIR", "confirmations": 6 },
  { "txid": "f1a8c2...", "direction": "sent",     "amount": "1.50 AIIR",  "confirmations": 12 }
]`,
  },
  {
    name: 'sendtoaddress',
    group: 'wallet',
    signature: 'sendtoaddress <to> <amount> [priority] [from]',
    description: {
      en: 'Sends a payment to a BitAiir address. Selects coins, signs the transaction synchronously, then mines the anti-spam proof of work and broadcasts in the background — the call returns in under 100 ms regardless of mining load.',
      'pt-br': 'Envia um pagamento para um endereço BitAiir. Seleciona moedas, assina a transação de forma síncrona e depois mina o proof-of-work anti-spam e propaga em segundo plano — a chamada retorna em menos de 100 ms independente da carga de mineração.',
    },
    params: [
      { name: 'to_address', type: 'string', required: true },
      { name: 'amount', type: 'f64 (AIIR)', required: true },
      { name: 'priority', type: 'u64', required: false },
      { name: 'from_address', type: 'string', required: false },
    ],
    cliExample: 'bitaiir-cli sendtoaddress aiir1KXgUaSrv31thw41QTrb3MpK9FBziQQZ8T 1.5',
    responseExample: `{
  "txid": "5cbe93...",
  "status": "added to mempool"
}`,
  },
  {
    name: 'exportwallet',
    group: 'wallet',
    signature: 'exportwallet <filename>',
    description: {
      en: 'Writes every wallet key to a JSON backup file (private keys in WIF format). The wallet must be unlocked.',
      'pt-br': 'Grava todas as chaves da carteira em um arquivo JSON de backup (chaves privadas em formato WIF). A carteira precisa estar destravada.',
    },
    params: [{ name: 'filename', type: 'string (path)', required: true }],
    cliExample: 'bitaiir-cli exportwallet wallet-backup.json',
    responseExample: `"Wrote 4 keys to wallet-backup.json"`,
  },
  {
    name: 'importwallet',
    group: 'wallet',
    signature: 'importwallet <filename>',
    description: {
      en: 'Imports keys from a previously exported JSON backup. Existing keys are kept; duplicates are skipped.',
      'pt-br': 'Importa chaves de um backup JSON previamente exportado. Chaves existentes são mantidas; duplicadas são ignoradas.',
    },
    params: [{ name: 'filename', type: 'string (path)', required: true }],
    cliExample: 'bitaiir-cli importwallet wallet-backup.json',
    responseExample: `"Imported 3 new keys (1 already present)"`,
  },
  {
    name: 'importprivkey',
    group: 'wallet',
    signature: 'importprivkey <wif>',
    description: {
      en: 'Imports a single private key in WIF (Wallet Import Format). Returns the derived address.',
      'pt-br': 'Importa uma única chave privada em WIF (Wallet Import Format). Retorna o endereço derivado.',
    },
    params: [{ name: 'wif', type: 'string (Base58Check WIF)', required: true }],
    cliExample: 'bitaiir-cli importprivkey 5K...',
    responseExample: `{ "address": "aiir1KXg...", "imported": true }`,
  },
  {
    name: 'getmnemonic',
    group: 'wallet',
    signature: 'getmnemonic',
    description: {
      en: 'Reveals the 24-word BIP39 seed phrase that generates every HD address on the wallet. Treat it like cash — anyone with the phrase controls the wallet.',
      'pt-br': 'Revela a seed phrase BIP39 de 24 palavras que gera todos os endereços HD da carteira. Trate como dinheiro vivo — quem tem a frase controla a carteira.',
    },
    params: [],
    cliExample: 'bitaiir-cli getmnemonic',
    responseExample: `{
  "mnemonic": "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action active actor actress",
  "next_index": 4
}`,
  },
  {
    name: 'importmnemonic',
    group: 'wallet',
    signature: 'importmnemonic <phrase>',
    description: {
      en: 'Restores a wallet from a 24-word BIP39 phrase. Re-derives the first N addresses and persists them.',
      'pt-br': 'Restaura uma carteira a partir de uma frase BIP39 de 24 palavras. Re-deriva os primeiros N endereços e os persiste.',
    },
    params: [{ name: 'phrase', type: 'string (24 words)', required: true }],
    cliExample: 'bitaiir-cli importmnemonic "abandon ability able ... action active actor actress"',
    responseExample: `{ "imported_addresses": 4 }`,
  },
  {
    name: 'encryptwallet',
    group: 'wallet',
    signature: 'encryptwallet <passphrase>',
    description: {
      en: 'Encrypts every private key on disk with AES-256-GCM (key derived via Argon2id). The wallet stays unlocked after this call; subsequent restarts require the passphrase.',
      'pt-br': 'Criptografa todas as chaves privadas em disco com AES-256-GCM (chave derivada via Argon2id). A carteira fica destravada após a chamada; próximas inicializações exigem a senha.',
    },
    params: [{ name: 'passphrase', type: 'string', required: true }],
    cliExample: 'bitaiir-cli encryptwallet "correct horse battery staple"',
    responseExample: `"Wallet encrypted. Restart will require the passphrase."`,
  },
  {
    name: 'walletpassphrase',
    group: 'wallet',
    signature: 'walletpassphrase <passphrase> <timeout>',
    description: {
      en: 'Unlocks an encrypted wallet for the given timeout (seconds). After the timeout, keys are zeroized from memory.',
      'pt-br': 'Destrava uma carteira criptografada pelo tempo informado (em segundos). Após o timeout, as chaves são zeradas da memória.',
    },
    params: [
      { name: 'passphrase', type: 'string', required: true },
      { name: 'timeout', type: 'u64 (seconds)', required: true },
    ],
    cliExample: 'bitaiir-cli walletpassphrase "correct horse battery staple" 300',
    responseExample: `"Wallet unlocked for 300 s"`,
  },
  {
    name: 'walletlock',
    group: 'wallet',
    signature: 'walletlock',
    description: {
      en: 'Locks the wallet immediately, zeroizing private keys from memory.',
      'pt-br': 'Travla a carteira imediatamente, zerando as chaves privadas da memória.',
    },
    params: [],
    cliExample: 'bitaiir-cli walletlock',
    responseExample: `"Wallet locked"`,
  },

  // ───────────────────────── Mining ─────────────────────────
  {
    name: 'setmining',
    group: 'mining',
    signature: 'setmining <active>',
    description: {
      en: 'Starts (`true`) or stops (`false`) the embedded miner. Mining is opt-in — running a node does not mine by default.',
      'pt-br': 'Liga (`true`) ou desliga (`false`) o minerador embutido. Mineração é opcional — rodar um nó não minera por padrão.',
    },
    params: [{ name: 'active', type: 'bool', required: true }],
    cliExample: 'bitaiir-cli setmining true',
    responseExample: `"Mining started"`,
  },

  // ───────────────────────── Peers / Network ─────────────────────────
  {
    name: 'addpeer',
    group: 'peers',
    signature: 'addpeer <addr>',
    description: {
      en: 'Connects to a peer at `ip:port` and performs the BitAiir handshake. New peers automatically begin block sync if they are ahead.',
      'pt-br': 'Conecta a um peer em `ip:port` e executa o handshake do BitAiir. Novos peers começam o sync de blocos automaticamente se estiverem à frente.',
    },
    params: [{ name: 'addr', type: 'string (ip:port)', required: true }],
    cliExample: 'bitaiir-cli addpeer 127.0.0.1:8444',
    responseExample: `{ "peer": "127.0.0.1:8444", "status": "connected" }`,
  },
  {
    name: 'listpeers',
    group: 'peers',
    signature: 'listpeers',
    description: {
      en: 'Lists every currently connected peer with handshake metadata, height, and last-seen timestamp.',
      'pt-br': 'Lista todos os peers conectados no momento com metadados do handshake, altura e timestamp do último contato.',
    },
    params: [],
    cliExample: 'bitaiir-cli listpeers',
    responseExample: `[
  { "addr": "127.0.0.1:8444", "version": 1, "height": 12345, "last_seen": 1746230410 }
]`,
  },
  {
    name: 'listknownpeers',
    group: 'peers',
    signature: 'listknownpeers',
    description: {
      en: 'Lists every peer the node has ever heard about, connected or not, with backoff and ban state.',
      'pt-br': 'Lista todos os peers que o nó já conheceu, conectados ou não, com estado de backoff e ban.',
    },
    params: [],
    cliExample: 'bitaiir-cli listknownpeers',
    responseExample: `[
  { "addr": "127.0.0.1:8444", "source": "addpeer", "banned": false, "backoff_secs": 0 }
]`,
  },

  // ───────────────────────── Aliases ─────────────────────────
  {
    name: 'registeralias',
    group: 'aliases',
    signature: 'registeralias <name> <address> [from]',
    description: {
      en: 'Registers an on-chain alias mapping a human-friendly name to a BitAiir address. The fee (paid in AIIR) is locked into the alias record.',
      'pt-br': 'Registra um alias on-chain mapeando um nome amigável para um endereço BitAiir. A taxa (paga em AIIR) fica travada no registro do alias.',
    },
    params: [
      { name: 'name', type: 'string', required: true },
      { name: 'address', type: 'string', required: true },
      { name: 'from_address', type: 'string', required: false },
    ],
    cliExample: 'bitaiir-cli registeralias eduardo aiir1KXgUaSrv31thw41QTrb3MpK9FBziQQZ8T',
    responseExample: `{ "txid": "...", "alias": "eduardo", "address": "aiir1KXg..." }`,
  },
  {
    name: 'resolvealias',
    group: 'aliases',
    signature: 'resolvealias <name>',
    description: {
      en: 'Resolves an alias to its current address. Returns `null` if no alias is registered.',
      'pt-br': 'Resolve um alias para o endereço atual. Retorna `null` se nenhum alias estiver registrado.',
    },
    params: [{ name: 'name', type: 'string', required: true }],
    cliExample: 'bitaiir-cli resolvealias eduardo',
    responseExample: `{ "alias": "eduardo", "address": "aiir1KXg..." }`,
  },
  {
    name: 'listaliases',
    group: 'aliases',
    signature: 'listaliases',
    description: {
      en: 'Lists every alias registered on the chain along with its current address.',
      'pt-br': 'Lista todos os aliases registrados na cadeia junto com o endereço atual de cada.',
    },
    params: [],
    cliExample: 'bitaiir-cli listaliases',
    responseExample: `[
  { "alias": "eduardo", "address": "aiir1KXg..." },
  { "alias": "alice",   "address": "aiir1abc..." }
]`,
  },

  // ───────────────────────── Escrow ─────────────────────────
  {
    name: 'createescrow',
    group: 'escrow',
    signature: 'createescrow <amount> <m> <addresses> <timeout_blocks> <refund_address>',
    description: {
      en: 'Locks AIIR into a multisig escrow. Requires `m` of `addresses.length` signatures to spend. After `timeout_blocks` blocks the funds can be refunded to `refund_address`.',
      'pt-br': 'Tranca AIIR em um escrow multisig. Exige `m` de `addresses.length` assinaturas para gastar. Após `timeout_blocks` blocos, os fundos podem ser reembolsados para `refund_address`.',
    },
    params: [
      { name: 'amount', type: 'f64 (AIIR)', required: true },
      { name: 'm', type: 'u8', required: true },
      { name: 'addresses', type: 'string[]', required: true },
      { name: 'timeout_blocks', type: 'u32', required: true },
      { name: 'refund_address', type: 'string', required: true },
    ],
    cliExample: 'bitaiir-cli createescrow 10.0 2 \'["aiir1...", "aiir1..."]\' 1000 aiir1refund...',
    responseExample: `{
  "txid": "...",
  "vout": 0,
  "redeem_script": "...",
  "expires_at_height": 13345
}`,
  },
  {
    name: 'refundescrow',
    group: 'escrow',
    signature: 'refundescrow <txid> <vout>',
    description: {
      en: 'Reclaims an expired escrow output to the original refund address. Fails if the timeout has not yet elapsed.',
      'pt-br': 'Recupera uma saída de escrow expirada para o endereço de refund original. Falha se o timeout ainda não tiver passado.',
    },
    params: [
      { name: 'txid', type: 'string (hex)', required: true },
      { name: 'vout', type: 'u32', required: true },
    ],
    cliExample: 'bitaiir-cli refundescrow 5cbe93... 0',
    responseExample: `{ "txid": "...", "status": "refunded" }`,
  },
  {
    name: 'listescrows',
    group: 'escrow',
    signature: 'listescrows',
    description: {
      en: 'Lists every escrow output the wallet currently participates in (as funder, party, or refund recipient).',
      'pt-br': 'Lista todas as saídas de escrow nas quais a carteira está envolvida no momento (como financiador, parte ou destinatário do refund).',
    },
    params: [],
    cliExample: 'bitaiir-cli listescrows',
    responseExample: `[
  { "txid": "...", "vout": 0, "amount": "10.00 AIIR", "expires_at_height": 13345, "role": "party" }
]`,
  },

  // ───────────────────────── Daemon ─────────────────────────
  {
    name: 'stop',
    group: 'daemon',
    signature: 'stop',
    description: {
      en: 'Tells the daemon to flush state and shut down cleanly. The cookie file is removed on graceful exit.',
      'pt-br': 'Pede para o daemon descarregar o estado e desligar de forma limpa. O arquivo cookie é removido no shutdown gracioso.',
    },
    params: [],
    cliExample: 'bitaiir-cli stop',
    responseExample: `"Daemon shutting down"`,
  },
];
