🚗 CarRentalBR – MVP Completo (Marketplace de Aluguel de Veículos P2P)
📋 1. Visão Geral do Projeto
O CarRentalBR é um marketplace peer‑to‑peer para aluguel de carros e motos, focado no mercado brasileiro. O MVP (Minimum Viable Product) oferece:

Três perfis de usuário: Hóspede (quem aluga), Anfitrião (quem anuncia veículos) e Administrador (modera e gerencia a plataforma).

Fluxo completo: cadastro/login, listagem de veículos, busca, página de detalhes, solicitação de reserva (simulada), dashboard do anfitrião com gestão de veículos e pedidos, dashboard do administrador com visão geral e moderação.

Tema escuro profissional com gradientes, glassmorphism, animações e responsividade mobile‑first.

Dados mockados (sem dependência do Supabase) para demonstração e testes imediatos.

🎨 2. Design System e Tecnologias
Recurso	Tecnologia	Finalidade
Framework UI	React 18 + Vite	Performance e estrutura moderna
Estilos	Tailwind CSS v4	Utilitários e tema escuro personalizado
Animações	Framer Motion	Transições suaves entre páginas e interações
Gráficos	Recharts	Dashboard administrativo
Ícones	Lucide React	Conjunto consistente de ícones
Rotas	React Router DOM	Navegação protegida com PrivateRoute
Notificações	React Hot Toast	Feedback visual de ações (login, reserva, etc.)
Dados	Mock local	src/mocks/data.js (substituível por Supabase depois)
Paleta de Cores (Modo Escuro)
Uso	Cor (Tailwind)	Exemplo
Fundo principal	from-slate-900 to-slate-800	Gradiente
Cards / modais	bg-slate-800/50 + border-white/10	Vidro fosco
Texto principal	text-white	Títulos
Texto secundário	text-slate-300 ou text-slate-400	Descrições
Destaques, links, botões	text-blue-400 / bg-gradient-to-r from-blue-600 to-blue-700	Ações primárias
Erro	text-red-400	Mensagens de erro
Sucesso	text-green-400	Toasts e badges
👥 3. Perfis de Usuário e Permissões
Perfil	Acesso	Funcionalidades
Hóspede (guest)	Público + logado	Visualizar veículos, ver detalhes, fazer reservas, avaliar após conclusão.
Anfitrião (host)	Dashboard host	CRUD de veículos, estatísticas (ganhos, ocupação), gerenciar pedidos (aprovar/recusar).
Administrador (admin)	Dashboard admin	Ver todos os usuários/veículos/reservas, alterar papéis, aprovar/reprovar conteúdo.
🖥️ 4. Lista de Telas e Funcionalidades
4.1. Login / Cadastro (/login)
Componente	Descrição
Formulário	Alterna entre “Entrar” e “Cadastrar”.
Campos (login)	E-mail, senha.
Campos (cadastro)	Nome completo, e-mail, senha, confirmar senha.
Validação Zod	E-mail válido, senha ≥6 caracteres, confirmação igual.
Ações	Botão “Entrar” / “Cadastrar”, link “Já tem conta?” / “Não tem conta?”.
Redirecionamento	Após login → Home; após cadastro → limpa formulário e vai para login (exige novo login simulado).
4.2. Home / Listagem de Veículos (/)
Componente	Descrição
Header	Logo (gradiente), nome do usuário logado (se houver), links: Perfil, Dashboard (se host ou admin), Sair / Entrar.
Barra de busca	Filtra veículos por título (client‑side).
Cards de veículos	Exibe imagem, título, preço/dia, localização, avaliação média (mock).
Interação	Clique no card → página de detalhes do veículo.
Dados	Mock mockVehicles.
4.3. Detalhes do Veículo (/vehicles/:id)
Componente	Descrição
Galeria	Imagem principal (futuro carrossel).
Informações principais	Título, subtítulo, localização completa.
Especificações	Potência, quilometragem, motor, aceleração, velocidade máxima, consumo.
Preço e reserva	Exibe preço/dia + valor total (mock).
Ações	Botão “Reservar agora” (simula reserva com toast; em produção será formulário de datas).
Botões extras	Favoritar (estado local), compartilhar (abre URL).
4.4. Perfil do Usuário (/profile)
Componente	Descrição
Informações	Nome, e-mail, papel (guest/host/admin).
Campo para Anfitrião	Chave Pix (CPF, e-mail, telefone ou chave aleatória).
Ações	Salvar chave Pix (simulação com toast).
4.5. Dashboard do Anfitrião (/dashboard/host)
Componente	Descrição
Estáticas financeiras	Ganhos totais, reservas concluídas, taxa de ocupação (mock).
Lista de veículos	Cards com imagem, título, preço. Botões Editar / Excluir.
Botão “Adicionar Veículo”	Abre modal com formulário (título, preço/dia – básico para MVP).
Modal de edição	Mesmo formulário com dados pré‑preenchidos.
Ações de veículo	Criar, editar, excluir (simuladas com toast).
4.6. Minhas Reservas (/reservations)
Componente	Descrição
Listagem	Reservas (mock) do usuário logado (filtradas por guest_id ou host_id).
Informações	Veículo, período, valor total, status (pending / approved / completed / cancelled).
Ações para anfitrião	Se status pending, botões Aprovar / Recusar (altera status localmente).
Mensagem	Se lista vazia: “Nenhuma reserva encontrada.”
4.7. Dashboard do Administrador (/admin)
Componente	Descrição
Cards de estatísticas	Total de usuários, veículos, reservas, faturamento simulado.
Tabs	Estatísticas (gráfico), Usuários, Veículos, Reservas.
Gráfico	BarChart com Recharts (Usuários, Veículos, Reservas).
Tabela Usuários	Nome, e-mail, papel (dropdown para alterar role).
Tabela Veículos	Título, preço, status, botão Aprovar (mock).
Tabela Reservas	ID, veículo, total, status, dropdown para alterar status.
Animações	Cards com hover scale, transições nas tabs.
4.8. Páginas Adicionais (já implementadas)
404 – Não implementado (pode usar fallback do React Router).

Tela de carregamento (spinner centralizado) enquanto busca dados mockados (delay artificial de 500ms).

🗃️ 5. Modelo de Dados (Mock)
Todos os dados estão em src/mocks/data.js. As principais entidades:

mockUsers
js
{ id, email, role, full_name, pix_key }
mockVehicles
js
{
  id, owner_id, title, subtitle, description, category, subcategory, seats,
  fuel_type, transmission, price_per_day, location_city, location_state,
  location_full, images, specs: { power, mileage, engine, acceleration, top_speed, fuel_consumption },
  status, created_at
}
mockBookings
js
{
  id, vehicle_id, guest_id, host_id, start_date, end_date, total_price,
  status, payment_confirmed, contract_pdf_url, payment_proof_url,
  vehicles: (referência ao veículo), host_pix_key
}
mockReviews
js
{ id, booking_id, reviewer_id, reviewee_id, rating, comment }
✨ 6. Novas Funcionalidades para Completar o MVP (Sugestões)
Para tornar o MVP mais robusto e próximo de um produto real, podemos implementar as seguintes funcionalidades complementares (já planejadas para as próximas etapas):

Funcionalidade	Descrição	Prioridade
🔍 Filtros avançados	Localidade, datas, categoria, faixa de preço, combustível, câmbio.	Alta
📅 Seleção de datas na reserva	Date picker para retirada e devolução, cálculo dinâmico de dias e valor total.	Alta
💳 Simulação de pagamento	Tela de checkout com escolha de Pix, cartão, upload de comprovante (mock).	Média
📄 Contrato digital	Modal com template editável, assinatura simulada, geração de PDF (biblioteca jspdf).	Média
📸 Checklist fotográfico	Antes e depois do aluguel (upload de imagens).	Média
🔔 Notificações	Toasts em tempo real para aprovação/rejeição de reserva.	Média
🗺️ Mapa de localização	Integração com Leaflet / Google Maps para exibir endereço do veículo.	Baixa
💬 Chat entre hóspede e anfitrião	Mensagens dentro da reserva (Supabase Realtime).	Baixa
📊 Exportar relatório	Gerar PDF da viagem (contrato + fotos).	Baixa
🧪 Testes automatizados	Unitários e de integração (Jest + React Testing Library).	Baixa
🛠️ 7. Arquitetura Técnica (MVP Atual)
text
src/
├── components/
│   ├── ui/                     (Card, Button – opcionais)
│   ├── VehicleCard.jsx
│   ├── VehicleCardPublic.jsx
│   └── VehicleForm.jsx
├── contexts/
│   └── AuthContext.jsx        (mock, com signIn/signUp/signOut/updatePixKey)
├── hooks/
│   ├── useBookings.js
│   ├── usePublicVehicles.js
│   └── useVehicles.js
├── mocks/
│   └── data.js
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Home.jsx
│   ├── HostDashboard.jsx
│   ├── Login.jsx
│   ├── MyReservations.jsx
│   ├── Profile.jsx
│   └── VehicleDetail.jsx
├── router/
│   └── PrivateRoute.jsx
├── App.jsx
├── index.css
└── main.jsx
Fluxo de Autenticação (Mock)
signIn aguarda 600ms, valida credenciais fixas guest@example.com / 123456, host@example.com / 123456, admin@example.com / 123456.

Após login, guarda user e profile no contexto.

PrivateRoute verifica user e role para rotas protegidas.

Comunicação entre componentes
Páginas acessam dados através dos hooks usePublicVehicles, useVehicles, useBookings.

Nenhuma chamada de rede real – tudo simulado com setTimeout.

✅ 8. Como Executar o MVP
bash
# Clone o repositório (ou crie a partir dos códigos)
cd car-rental-marketplace
npm install
npm run dev
Credenciais para teste:

Hóspede: guest@example.com / 123456

Anfitrião: host@example.com / 123456

Administrador: admin@example.com / 123456

Navegação sugerida:

Login como hóspede → Home → Detalhes de veículo → “Reservar agora” (toast).

Login como anfitrião → Dashboard → Adicionar veículo → Editar/Excluir.

Login como administrador → Admin → Visualizar gráficos e tabelas, alterar papéis.

📌 9. Próximos Passos (Pós‑MVP)
Substituir dados mockados por Supabase real (manter os mesmos hooks, apenas trocar a lógica interna).

Implementar seleção de datas e cálculo de preço na página de detalhes.

Adicionar formulário de reserva (enviar para tabela bookings).

Checklist fotográfico e contrato digital.

Dashboard do anfitrião com integração real (estatísticas vindas do banco).

Notificações push/email (lembretes de reserva, mudança de status).

🎯 Conclusão
O MVP do CarRentalBR entrega um marketplace funcional, com design moderno e responsivo, todas as telas principais, fluxos de autenticação e gestão de veículos/reservas simulados. A arquitetura limpa permite a troca gradual do mock pelo Supabase real sem refatorar os componentes. As funcionalidades propostas para a próxima fase completarão o ciclo de aluguel peer‑to‑peer de forma profissional.

Documento atualizado em: 08/05/2026
Versão: MVP 1.0 – Dark Theme + Mock Data + Todas as Telas Navegáveis

🚀 Pronto para evoluir!