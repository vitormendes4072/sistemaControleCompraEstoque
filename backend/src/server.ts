import express from 'express';
import productRoutes from './routes/products';
import inventoryRoutes from './routes/inventory';
import replenishmentRoutes from './routes/replenishment'; // 👈 NOVA IMPORT

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);


// Healthcheck (verifica se a API está no ar)
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'backend', version: '0.1.0' });
});

// Rota raiz
app.get('/', (_req, res) => {
  res.send('API online ✅');
});

// Rotas de produtos
app.use('/api/products', productRoutes);

app.use('/api/replenishment', replenishmentRoutes); // 👈 NOVA ROTA


// fallback de erro (opcional)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[err]', err);
  res.status(500).json({ error: 'Erro inesperado' });
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log('\n🚀 Servidor FBA Replenishment System');
  console.log('=====================================');
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`📦 Produtos: http://localhost:${PORT}/api/products`);
  console.log(`📊 Estoque: http://localhost:${PORT}/api/inventory`);
  console.log(`🔄 Replenishment: http://localhost:${PORT}/api/replenishment`); // 👈 NOVA LINHA
  console.log('=====================================\n');
});
