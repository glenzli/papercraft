import { createServer } from 'vite'
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
try { await server.ssrLoadModule('/tests/paper.test.ts') }
finally { await server.close() }
