/**
 * Blockchain Timestamping — Polygon Network
 * Records document SHA-256 hash on-chain as immutable proof of existence.
 * 
 * Uses a server-side relayer wallet so users don't need MATIC.
 * Hash stored in transaction data field → publicly verifiable.
 */

import { sha256 } from './crypto'

const POLYGON_RPC = import.meta.env.VITE_POLYGON_RPC || 'https://polygon-rpc.com'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface BlockchainTimestamp {
  txHash: string
  documentHash: string
  blockNumber: number
  timestamp: Date
  polygonScanUrl: string
  verified: boolean
}

/**
 * Timestamp a document via the backend relayer (no MATIC needed by user).
 * The backend sends the tx on Polygon using the server relayer wallet.
 */
export async function timestampDocument(
  content: string,
  metadata: { docType: string; userId?: string }
): Promise<BlockchainTimestamp> {
  const documentHash = await sha256(content + JSON.stringify(metadata))

  try {
    const res = await fetch(`${API_BASE}/api/v1/documents/timestamp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_hash: documentHash, doc_type: metadata.docType }),
    })

    if (res.ok) {
      const data = await res.json()
      return {
        txHash: data.tx_hash,
        documentHash,
        blockNumber: data.block_number || 0,
        timestamp: new Date(data.timestamp || Date.now()),
        polygonScanUrl: `https://polygonscan.com/tx/${data.tx_hash}`,
        verified: true,
      }
    }
  } catch {
    // Fall through to mock
  }

  // Mock timestamp for dev (no Polygon configured)
  const mockTx = '0x' + documentHash.substring(0, 64)
  return {
    txHash: mockTx,
    documentHash,
    blockNumber: 0,
    timestamp: new Date(),
    polygonScanUrl: `https://polygonscan.com/tx/${mockTx}`,
    verified: false,  // Indicates mock/dev mode
  }
}

/**
 * Verify a document against its blockchain record.
 * User pastes document content → we compute hash → check against chain.
 */
export async function verifyDocument(
  content: string,
  claimedTxHash: string
): Promise<{ valid: boolean; message: string; documentHash: string }> {
  const documentHash = await sha256(content)

  try {
    const res = await fetch(`${API_BASE}/api/v1/documents/verify?tx_hash=${claimedTxHash}&doc_hash=${documentHash}`)
    if (res.ok) {
      const data = await res.json()
      return {
        valid: data.verified,
        message: data.verified
          ? `✅ Document verified! Timestamped on ${new Date(data.timestamp).toLocaleDateString('en-IN')} (Block ${data.block_number})`
          : '❌ Document hash does not match blockchain record. Document may have been modified.',
        documentHash,
      }
    }
  } catch { /* fall through */ }

  // Client-side verification (check if tx data contains the hash)
  return verifyOnChain(documentHash, claimedTxHash)
}

/** Direct Polygon RPC verification (no backend needed) */
async function verifyOnChain(
  documentHash: string,
  txHash: string
): Promise<{ valid: boolean; message: string; documentHash: string }> {
  try {
    const res = await fetch(POLYGON_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txHash],
        id: 1,
      }),
    })
    const data = await res.json()
    const txData: string = data?.result?.input || ''

    // Check if the document hash appears in the tx data field
    const valid = txData.toLowerCase().includes(documentHash.toLowerCase())
    return {
      valid,
      message: valid
        ? '✅ Document verified on Polygon blockchain! Hash confirmed.'
        : '❌ Hash not found in transaction data.',
      documentHash,
    }
  } catch {
    return {
      valid: false,
      message: '⚠ Could not reach Polygon network. Please try again.',
      documentHash,
    }
  }
}

/**
 * Format blockchain proof for document footer (PDF embed).
 * Shows: SHA-256: 0xABCD...  |  Polygon TX: 0x1234...  |  Date: DD/MM/YYYY
 */
export function formatBlockchainFooter(timestamp: BlockchainTimestamp): string {
  const date = timestamp.timestamp.toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
  const shortHash = `${timestamp.documentHash.substring(0, 16)}...`
  const shortTx = `${timestamp.txHash.substring(0, 16)}...`
  return `SHA-256: ${shortHash} | Polygon: ${shortTx} | ${date} | Verify: nyayamitra.in/verify`
}

export default { timestampDocument, verifyDocument, formatBlockchainFooter }
