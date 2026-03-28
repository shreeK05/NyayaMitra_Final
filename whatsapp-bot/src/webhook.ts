/**
 * NyayaMitra WhatsApp Bot — Node.js + Express
 * Handles Meta Webhook, routes messages to FastAPI RAG backend
 * 
 * Deploy: Railway / Render / Fly.io as separate service
 * Webhook URL: https://bot.nyayamitra.in/webhook
 */

import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

const {
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  WHATSAPP_VERIFY_TOKEN = 'nyayamitra_webhook_secret',
  NYAYAMITRA_API_URL = 'http://localhost:8000',
  PORT = 3001,
} = process.env

// ── Webhook Verification (GET) ─────────────────────────────
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook verified by Meta')
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

// ── Message Handler (POST) ─────────────────────────────────
app.post('/webhook', async (req, res) => {
  res.sendStatus(200) // Acknowledge immediately (within 20s requirement)

  try {
    const entry = req.body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const messages = value?.messages

    if (!messages?.length) return

    const msg = messages[0]
    const phone = msg.from
    const msgType = msg.type

    console.log(`📥 Message from ${phone}: type=${msgType}`)

    // Handle different message types
    if (msgType === 'text') {
      await handleTextMessage(phone, msg.text.body)
    } else if (msgType === 'audio') {
      await handleAudioMessage(phone, msg.audio.id)
    } else if (msgType === 'image' || msgType === 'document') {
      await handleDocumentMessage(phone, msg[msgType], msgType)
    } else if (msgType === 'interactive') {
      await handleInteractiveReply(phone, msg.interactive)
    } else {
      await sendWhatsAppMessage(phone,
        '🙏 Namaste! I can understand text messages. Please type your legal question in Hindi or English.'
      )
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }
})

// ── Text Message Handler ───────────────────────────────────
async function handleTextMessage(phone: string, text: string) {
  const lowerText = text.toLowerCase().trim()

  // Special commands
  if (lowerText === 'help' || lowerText === 'start' || lowerText === 'शुरू') {
    return sendWhatsAppMessage(phone, HELP_MESSAGE)
  }

  if (lowerText === 'score' || lowerText === 'स्कोर') {
    return sendNyayaScorePrompt(phone)
  }

  if (lowerText === 'dlsa' || lowerText === 'lawyer') {
    return sendDLSAInfo(phone)
  }

  // Main RAG legal query
  await sendWhatsAppMessage(phone, '⏳ Searching Indian law for your question...')

  try {
    const lang = detectLanguage(text)
    const response = await axios.post(`${NYAYAMITRA_API_URL}/api/v1/counsellor/text`, {
      query: text,
      language: lang,
      user_id: phone,
    }, { timeout: 30000 })

    const data = response.data
    const answer = formatForWhatsApp(data.answer || data.response || 'Please try again.')
    const confidence = data.confidence || 0
    const winProb = data.win_probability

    let whatsappMsg = answer

    if (data.relevant_acts?.length) {
      whatsappMsg += `\n\n📚 *Applicable Law:*\n${data.relevant_acts.slice(0, 3).map((a: string) => `• ${a}`).join('\n')}`
    }

    if (winProb) {
      whatsappMsg += `\n\n📊 *Estimated Success Rate:* ${Math.round(winProb * 100)}%`
    }

    if (confidence < 0.65) {
      whatsappMsg += '\n\n⚠ _This is a complex matter. Please consult a DLSA lawyer for free._'
    }

    whatsappMsg += '\n\n🔗 Full analysis: nyaya-mitra-ai-legal-assistant.vercel.app'

    await sendWhatsAppMessage(phone, whatsappMsg)

    // After legal answer, offer document generation
    if (confidence > 0.5 && data.suggested_doc_type) {
      await sendInteractiveButtons(phone,
        `Do you need to send a legal notice? I can generate one for you.`,
        [
          { id: `gen_${data.suggested_doc_type}`, title: '📄 Generate Notice' },
          { id: 'more_info', title: '❓ More Info' },
        ]
      )
    }
  } catch (err: any) {
    console.error('RAG query failed:', err.message)
    await sendWhatsAppMessage(phone,
      `Sorry, I'm having trouble right now. For immediate help:\n\n🏛 DLSA Helpline: *15100*\n👮 Police Emergency: *100*\n🏥 Women Helpline: *181*`
    )
  }
}

// ── Audio Voice Message Handler ────────────────────────────
async function handleAudioMessage(phone: string, audioId: string) {
  try {
    await sendWhatsAppMessage(phone, '🎙 Processing your voice message...')

    // Download audio from WhatsApp servers
    const mediaUrl = await getWhatsAppMediaUrl(audioId)
    const audioBuffer = await downloadMedia(mediaUrl)

    // Send to Sarvam STT via NyayaMitra backend
    const formData = new FormData()
    const blob = new Blob([audioBuffer], { type: 'audio/ogg' })
    formData.append('audio', blob, 'voice.ogg')

    const sttRes = await axios.post(`${NYAYAMITRA_API_URL}/api/v1/counsellor/voice`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })

    if (sttRes.data?.answer) {
      const answer = formatForWhatsApp(sttRes.data.answer)
      await sendWhatsAppMessage(phone, `🎙 *Your question:* "${sttRes.data.transcript}"\n\n${answer}`)
    }
  } catch {
    await sendWhatsAppMessage(phone, 'Could not process voice. Please type your question in Hindi or English.')
  }
}

// ── Document Upload Handler ────────────────────────────────
async function handleDocumentMessage(phone: string, media: any, type: string) {
  await sendWhatsAppMessage(phone, '📋 Analysing your document...')
  // Future: send to /api/v1/decoder/analyze endpoint
  await sendWhatsAppMessage(phone,
    '🔍 For full document clause analysis with Red/Amber/Green ratings, open our app:\n' +
    '🔗 nyaya-mitra-ai-legal-assistant.vercel.app/decoder'
  )
}

// ── Interactive Reply Handler ──────────────────────────────
async function handleInteractiveReply(phone: string, interactive: any) {
  const buttonId = interactive?.button_reply?.id || interactive?.list_reply?.id || ''

  if (buttonId.startsWith('gen_')) {
    const docType = buttonId.replace('gen_', '')
    await sendWhatsAppMessage(phone,
      `📄 To generate a ${docType.replace('_', ' ')}, visit:\n🔗 nyaya-mitra-ai-legal-assistant.vercel.app/generator\n\nOr describe your situation and I'll guide you step by step.`
    )
  } else if (buttonId === 'dlsa') {
    await sendDLSAInfo(phone)
  } else if (buttonId === 'more_info') {
    await sendWhatsAppMessage(phone, 'Please describe what happened in detail and I will analyse it.')
  }
}

// ── WhatsApp API Helpers ───────────────────────────────────
async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[MOCK WhatsApp to ${to}]:`, text.substring(0, 100))
    return
  }

  await axios.post(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text.substring(0, 4096) }, // WhatsApp limit
    },
    { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
  )
}

async function sendInteractiveButtons(to: string, body: string, buttons: Array<{ id: string; title: string }>) {
  if (!WHATSAPP_TOKEN) {
    console.log(`[MOCK interactive to ${to}]:`, body)
    return
  }

  await axios.post(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: {
          buttons: buttons.slice(0, 3).map(b => ({
            type: 'reply',
            reply: { id: b.id, title: b.title.substring(0, 20) }
          }))
        }
      }
    },
    { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
  )
}

async function getWhatsAppMediaUrl(mediaId: string): Promise<string> {
  const res = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}`, {
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
  })
  return res.data.url
}

async function downloadMedia(url: string): Promise<Buffer> {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
    responseType: 'arraybuffer'
  })
  return Buffer.from(res.data)
}

// ── Utility Functions ──────────────────────────────────────
function detectLanguage(text: string): string {
  // Basic Devanagari script detection
  const devanagariRegex = /[\u0900-\u097F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const bengaliRegex = /[\u0980-\u09FF]/
  const teluguRegex = /[\u0C00-\u0C7F]/

  if (devanagariRegex.test(text)) return 'hi'
  if (tamilRegex.test(text)) return 'ta'
  if (bengaliRegex.test(text)) return 'bn'
  if (teluguRegex.test(text)) return 'te'
  return 'en'
}

function formatForWhatsApp(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '*$1*')    // Bold: **text** → *text*
    .replace(/#{1,3}\s/g, '*')            // Headers → bold
    .replace(/`([^`]+)`/g, '_$1_')       // Code → italic
    .replace(/- /g, '• ')               // Lists
    .substring(0, 4096)
}

async function sendDLSAInfo(phone: string) {
  await sendWhatsAppMessage(phone,
    `🏛 *Free Legal Help in India:*\n\n` +
    `📞 DLSA National Helpline: *15100* (Free)\n` +
    `🌐 NALSA: nalsa.gov.in\n\n` +
    `*Who qualifies for free legal aid?*\n` +
    `• Income below Rs.1 lakh/year\n` +
    `• SC/ST/Women/Disabled persons\n` +
    `• Disaster/trafficking victims\n` +
    `• Industrial workers\n\n` +
    `Type your district name for local DLSA contact.`
  )
}

async function sendNyayaScorePrompt(phone: string) {
  await sendWhatsAppMessage(phone,
    `📊 *Check your NyayaScore (Legal Health 0-100)*\n\n` +
    `Answer 5 quick questions:\n` +
    `1. Do you have a written employment contract? (Yes/No)\n` +
    `2. Is your rental agreement registered? (Yes/No)\n` +
    `3. Any pending legal disputes? (Yes/No)\n` +
    `4. Have you filed RTI/consumer complaint before? (Yes/No)\n` +
    `5. Do you know your DLSA rights? (Yes/No)\n\n` +
    `Reply with 5 answers like: Yes No No Yes No\n` +
    `Or visit: nyaya-mitra-ai-legal-assistant.vercel.app/score`
  )
}

const HELP_MESSAGE = `🙏 *Namaste! I am NyayaMitra* ⚖️

I provide *FREE* AI legal advice in your language.

*What I can help with:*
🏠 Landlord/Tenant disputes
💼 Salary & employment issues  
🛒 Consumer complaints
👮 FIR & police complaints
📋 Contract analysis
⚖️ Family & property matters

*Commands:*
• Type your question in Hindi or English
• Send *DLSA* for free lawyer info
• Send *SCORE* for your legal health score
• Send a document photo to analyse it

*Emergency:*
👮 Police: 100 | 🏥 Women: 181 | 🚑 Ambulance: 108

_NyayaMitra does not give legal advice. It gives legal ACTION._ ⚖️`

// ── Health Check ───────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'NyayaMitra WhatsApp Bot', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`🤖 NyayaMitra WhatsApp Bot running on port ${PORT}`)
  console.log(`📋 Backend API: ${NYAYAMITRA_API_URL}`)
  console.log(`${WHATSAPP_TOKEN ? '✅' : '⚠'} WhatsApp Token: ${WHATSAPP_TOKEN ? 'configured' : 'MISSING (mock mode)'}`)
})

export default app
