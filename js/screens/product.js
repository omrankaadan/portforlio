export const PRODUCT = {
  name: "Garage Platform",
  tagline: "One workspace for garage operations.",
  nav: ["Overview", "Vehicles", "Parts", "Appointments"],
};

export const REQUIREMENTS = [
  { id: "01", title: "Vehicle & parts catalog", detail: "Searchable records in one workspace", done: true },
  { id: "02", title: "Inventory management", detail: "Track stock and import spreadsheet data", done: true },
  { id: "03", title: "Appointments", detail: "Manage upcoming garage work", done: true },
  { id: "04", title: "Secure administration", detail: "JWT authentication and role-based access", done: true },
  { id: "05", title: "Operational history", detail: "Audit logs and image-enabled admin tools", done: true },
];

export const PROJECT_FILES = [
  { dir: "src/", name: "components", kind: "dir", depth: 1 },
  { dir: "", name: "App.jsx", kind: "file", depth: 0 },
  { dir: "", name: "api.js", kind: "file", depth: 0 },
  { dir: "", name: "package.json", kind: "file", depth: 0 },
  { dir: "src/components/", name: "VehicleCatalog.jsx", kind: "file", depth: 1 },
  { dir: "src/components/", name: "PartsInventory.jsx", kind: "file", depth: 1 },
  { dir: "src/components/", name: "AppointmentList.jsx", kind: "file", depth: 1 },
  { dir: "src/components/", name: "AdminPanel.jsx", kind: "file", depth: 1 },
  { dir: "server/", name: "routes", kind: "dir", depth: 1 },
  { dir: "", name: "schema.sql", kind: "file", depth: 0 },
];

const TOKENS = ["vehicles", "parts", "inventory", "appointments", "auth", "roles", "auditLogs", "api", "admin", "app"];

export function codeLines(q) {
  const n = Math.max(2, Math.round(6 + q * 34));
  const out = [
    { t: "import { useEffect, useState } from 'react'", k: 1 },
    { t: "import { api } from './api'", k: 2 },
    { t: "import { PartsInventory } from './components/PartsInventory'", k: 3 },
    { t: "", k: 0 },
    { t: "export default function App() {", k: 4 },
    { t: "  const [parts, setParts] = useState([])", k: 5 },
    { t: "  const [query, setQuery] = useState('')", k: 6 },
    { t: "", k: 0 },
    { t: "  useEffect(() => {", k: 7 },
    { t: "    api.get('/api/parts')", k: 8 },
    { t: "      .then((r) => setParts(r.data))", k: 9 },
    { t: "      .catch(console.error)", k: 9 },
    { t: "  }, [])", k: 7 },
    { t: "", k: 0 },
    { t: "  async function importStock(file) {", k: 5 },
    { t: "    await api.post('/api/inventory/import', {", k: 8 },
    { t: "      file,", k: 9 },
    { t: "      validateRows: true,", k: 9 },
    { t: "    })", k: 7 },
    { t: "  }", k: 4 },
    { t: "", k: 0 },
    { t: "  return (", k: 4 },
    { t: "    <main className='app'>", k: 5 },
    { t: "      <Nav items={NAV} />", k: 5 },
    { t: "      <PartsInventory items={parts} query={query} />", k: 5 },
    { t: "      <VehicleCatalog />", k: 5 },
    { t: "      <AppointmentList />", k: 5 },
    { t: "    </main>", k: 4 },
    { t: "  )", k: 4 },
    { t: "}", k: 0 },
  ];
  return out.slice(0, n);
}

export function terminalLines(q, shipped) {
  const workflow = [
    "$ npm run build",
    "  React client · Vite production bundle",
    "  Express REST API · PostgreSQL",
    "  JWT auth · role-based access",
    "  Zod validation · Swagger API docs",
  ];
  if (!shipped) return workflow.slice(0, 1 + Math.round(q * (workflow.length - 1)));
  return workflow.concat([
    "",
    "  Production deployment",
    "  Garage operations platform is live",
    "  ✓ Catalog · inventory · appointments",
    "  ↗ http://65.21.59.78/",
  ]);
}

export function randomToken(i) {
  return TOKENS[i % TOKENS.length];
}
