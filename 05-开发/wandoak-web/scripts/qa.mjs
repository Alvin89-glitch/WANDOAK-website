/**
 * build → preview → verify → tear the preview down again.
 *
 * The previous one-liner backgrounded `vite preview` with `&` and slept three
 * seconds. Nothing ever reaped that server, so the run never exited, and the
 * leftover process then held port 5179 against the next run's --strictPort —
 * which failed silently and left the assertions measuring whatever build the
 * stale server happened to be serving.
 *
 *   npm run qa
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const PORT = Number(process.env.QA_PORT ?? 5179)
const BASE = `http://localhost:${PORT}`

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    child.on('error', reject)
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(1500) })
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`preview did not answer on ${BASE} within ${timeoutMs}ms`)
}

let preview = null
let stopping = false
const stopPreview = () => {
  stopping = true
  if (preview && !preview.killed) preview.kill('SIGTERM')
  preview = null
}
process.on('exit', stopPreview)
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stopPreview(); process.exit(130) })

try {
  await run('npm', ['run', 'build'])

  preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'inherit'],
    shell: process.platform === 'win32',
  })
  preview.on('exit', (code) => {
    // A --strictPort clash exits immediately; say so rather than letting the
    // wait below time out with a vaguer message. Our own SIGTERM at the end
    // of a good run also lands here, so only speak up if we didn't ask.
    if (!stopping && code !== 0 && code !== null) {
      console.error(`\nvite preview exited ${code} — is port ${PORT} already in use?`)
    }
  })

  await waitForServer()
  await run('node', [path.join(HERE, 'verify.mjs'), BASE])
} finally {
  stopPreview()
}
