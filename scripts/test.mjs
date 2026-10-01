import { createServer } from 'vite'
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
try { await server.ssrLoadModule('/tests/locale.test.ts'); await server.ssrLoadModule('/tests/paper.test.ts'); await server.ssrLoadModule('/tests/professionalLivery.test.ts'); await server.ssrLoadModule('/tests/catalog.test.ts'); await server.ssrLoadModule('/tests/transport.test.ts') }
finally { await server.close() }
