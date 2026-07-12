import { useState } from "react";
import { 
  LayoutDashboard, Briefcase, Archive, Users, LogOut 
} from "lucide-react";
import "./Dashboard.css";

// Import our custom subcomponents
import Overview from "./components/Overview";
import KanbanBoards from "./components/KanbanBoards";
import Warehouse from "./components/Warehouse";
import Employees from "./components/Employees";
import EventDetailsModal from "./components/EventDetailsModal";

// Import shared types
import type { Project, Employee, WarehouseItem, InvoiceLog } from "./types";

// ── Initial Mock Data ──
const INITIAL_EVENTS: Project[] = [
  {
    id: "evt-1",
    name: "Estande Nestlé - Bienal do Livro 2026",
    client: "Nestlé S/A",
    phase: "during",
    startDate: "2026-07-20",
    completionRate: 60,
    checklist: [
      { id: "c1", text: "Avaliar plantas e projeto técnico do estande", done: true },
      { id: "c2", text: "Subir contrato comercial assinado", done: true },
      { id: "c3", text: "Alinhar e conferir logomarcas da marca", done: true },
      { id: "c4", text: "Comprar materiais para construção (mdf, caibros, tintas)", done: false },
      { id: "c5", text: "Pagar taxas e emitir ART/RRT de montagem", done: true },
      { id: "c6", text: "Escalar funcionários e enviar RG/CPF de todos", done: false },
      { id: "c7", text: "Organizar passagens aéreas e hotel da equipe", done: false },
      { id: "c8", text: "Conseguir termo de liberação assinado da organização", done: false }
    ],
    assignedEmployees: [
      { id: "emp-1", name: "José Alves de Oliveira", role: "Montador de Estande", documentStatus: "complete" },
      { id: "emp-2", name: "Carlos Henrique Lima", role: "Carpinteiro Montador", documentStatus: "complete" }
    ],
    assignedTools: [
      { id: "item-1", name: "Furadeira de Impacto Bosch", type: "tool", allocatedQty: 2 },
      { id: "item-2", name: "Serra Circular Dewalt", type: "tool", allocatedQty: 1 }
    ],
    hotelName: "Ibis Budget Center Paulista",
    hotelCheckin: "2026-07-19",
    flightDetails: "Latam LA3140 - NAT -> GRU (Conf: XPT991) - João e Carlos",
    docs: [
      { id: "d1", name: "Contrato de Prestação de Serviços", status: "approved" },
      { id: "d2", name: "ART/RRT de Responsabilidade Técnica", status: "uploaded" },
      { id: "d3", name: "Termo de Liberação Oficial do Pavilhão", status: "pending" }
    ]
  },
  {
    id: "evt-2",
    name: "Estande Heineken - Feira APAS 2026",
    client: "Cervejaria Heineken",
    phase: "no_event",
    startDate: "2026-08-05",
    completionRate: 25,
    checklist: [
      { id: "c1", text: "Avaliar plantas e projeto técnico do estande", done: true },
      { id: "c2", text: "Subir contrato comercial assinado", done: true },
      { id: "c3", text: "Alinhar e conferir logomarcas da marca", done: false },
      { id: "c4", text: "Comprar materiais para construção (mdf, caibros, tintas)", done: false },
      { id: "c5", text: "Pagar taxas e emitir ART/RRT de montagem", done: false },
      { id: "c6", text: "Escalar funcionários e enviar RG/CPF de todos", done: false },
      { id: "c7", text: "Organizar passagens aéreas e hotel da equipe", done: false },
      { id: "c8", text: "Conseguir termo de liberação assinado da organização", done: false }
    ],
    assignedEmployees: [],
    assignedTools: [],
    hotelName: "",
    hotelCheckin: "",
    flightDetails: "",
    docs: [
      { id: "d1", name: "Contrato de Prestação de Serviços", status: "approved" },
      { id: "d2", name: "ART/RRT de Responsabilidade Técnica", status: "pending" },
      { id: "d3", name: "Termo de Liberação Oficial do Pavilhão", status: "pending" }
    ]
  },
  {
    id: "evt-3",
    name: "Estande Petrobras - Rio Oil & Gas 2026",
    client: "Petróleo Brasileiro S.A.",
    phase: "post",
    startDate: "2026-06-15",
    completionRate: 100,
    checklist: [
      { id: "c1", text: "Avaliar plantas e projeto técnico do estande", done: true },
      { id: "c2", text: "Subir contrato comercial assinado", done: true },
      { id: "c3", text: "Alinhar e conferir logomarcas da marca", done: true },
      { id: "c4", text: "Comprar materiais para construção (mdf, caibros, tintas)", done: true },
      { id: "c5", text: "Pagar taxas e emitir ART/RRT de montagem", done: true },
      { id: "c6", text: "Escalar funcionários e enviar RG/CPF de todos", done: true },
      { id: "c7", text: "Organizar passagens aéreas e hotel da equipe", done: true },
      { id: "c8", text: "Conseguir termo de liberação assinado da organização", done: true }
    ],
    assignedEmployees: [
      { id: "emp-3", name: "Claudio Barbosa Silva", role: "Eletricista Operacional", documentStatus: "complete" }
    ],
    assignedTools: [],
    hotelName: "Hotel Windsor Barra",
    hotelCheckin: "2026-06-14",
    flightDetails: "Gol G3-1209 - NAT -> GIG - Localizador: GHJ441",
    docs: [
      { id: "d1", name: "Contrato de Prestação de Serviços", status: "approved" },
      { id: "d2", name: "ART/RRT de Responsabilidade Técnica", status: "approved" },
      { id: "d3", name: "Termo de Liberação Oficial do Pavilhão", status: "approved" }
    ]
  }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "José Alves de Oliveira", role: "Montador de Estande", documentStatus: "complete", hasSafetyCert: true },
  { id: "emp-2", name: "Carlos Henrique Lima", role: "Carpinteiro Montador", documentStatus: "complete", hasSafetyCert: true },
  { id: "emp-3", name: "Claudio Barbosa Silva", role: "Eletricista Operacional", documentStatus: "complete", hasSafetyCert: true },
  { id: "emp-4", name: "Ricardo Mendes Alves", role: "Coordenador de Estande", documentStatus: "pending", hasSafetyCert: true },
  { id: "emp-5", name: "Marcelo dos Santos", role: "Auxiliar Técnico", documentStatus: "pending", hasSafetyCert: false }
];

const INITIAL_WAREHOUSE: WarehouseItem[] = [
  { id: "item-1", name: "Furadeira de Impacto Bosch", type: "tool", stock: 12 },
  { id: "item-2", name: "Serra Circular Dewalt", type: "tool", stock: 4 }, // Low Stock
  { id: "item-3", name: "Parafusadeira Makita 12V", type: "tool", stock: 15 },
  { id: "item-4", name: "Andaime Tubular Aço (Módulo 1m)", type: "tool", stock: 30 },
  { id: "item-5", name: "Cadeira Estofada Office Preta", type: "furniture", stock: 50 },
  { id: "item-6", name: "Mesa Lateral Redonda de Vidro", type: "furniture", stock: 8 },
  { id: "item-7", name: "Banqueta Regulável Bistrô Cromada", type: "furniture", stock: 25 },
  { id: "item-8", name: "Refletor LED 100W Iluminação", type: "furniture", stock: 40 }
];

const INITIAL_INVOICES: InvoiceLog[] = [
  { id: "inv-1", vendor: "Comercial de Madeiras RN", invoiceNumber: "NF-8924", value: 3450.00, description: "30 Chapas MDF Cru 15mm, 15 Ripas Pinus 3m", date: "2026-07-08" },
  { id: "inv-2", vendor: "Eletro Ferragens Natal", invoiceNumber: "NF-1209", value: 450.00, description: "10 Refletores LED 50W, 2 Rolos Fio Cobre 2.5mm", date: "2026-07-10" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "kanban" | "warehouse" | "employees">("overview");
  
  // App Global State
  const [events, setEvents] = useState<Project[]>(INITIAL_EVENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(INITIAL_WAREHOUSE);
  const [invoiceLogs, setInvoiceLogs] = useState<InvoiceLog[]>(INITIAL_INVOICES);
  
  // Selected event details modal controller
  const [selectedEvent, setSelectedEvent] = useState<Project | null>(null);

  // ── Callbacks & Handlers ──

  // Add Event
  const addEvent = (name: string, client: string, startDate: string) => {
    const newEvent: Project = {
      id: `evt-${Date.now()}`,
      name,
      client,
      phase: "no_event",
      startDate,
      completionRate: 0,
      checklist: [
        { id: "c1", text: "Avaliar plantas e projeto técnico do estande", done: false },
        { id: "c2", text: "Subir contrato comercial assinado", done: false },
        { id: "c3", text: "Alinhar e conferir logomarcas da marca", done: false },
        { id: "c4", text: "Comprar materiais para construção (mdf, caibros, tintas)", done: false },
        { id: "c5", text: "Pagar taxas e emitir ART/RRT de montagem", done: false },
        { id: "c6", text: "Escalar funcionários e enviar RG/CPF de todos", done: false },
        { id: "c7", text: "Organizar passagens aéreas e hotel da equipe", done: false },
        { id: "c8", text: "Conseguir termo de liberação assinado da organização", done: false }
      ],
      assignedEmployees: [],
      assignedTools: [],
      hotelName: "",
      hotelCheckin: "",
      flightDetails: "",
      docs: [
        { id: "d1", name: "Contrato de Prestação de Serviços", status: "pending" },
        { id: "d2", name: "ART/RRT de Responsabilidade Técnica", status: "pending" },
        { id: "d3", name: "Termo de Liberação Oficial do Pavilhão", status: "pending" }
      ]
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Update Event Phase directly in Kanban
  const updateEventPhase = (id: string, phase: "no_event" | "during" | "post") => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, phase } : e))
    );
  };

  // Update Event Details in Modal
  const updateEventDetails = (updated: Project) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    // Keep local modal state synchronized
    setSelectedEvent(updated);
  };

  // Add Employee
  const addEmployee = (name: string, role: string, hasSafetyCert: boolean) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      role,
      documentStatus: "pending",
      hasSafetyCert
    };
    setEmployees((prev) => [...prev, newEmp]);
  };

  // Toggle Employee Doc status
  const toggleDocStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, documentStatus: e.documentStatus === "complete" ? "pending" : "complete" }
          : e
      )
    );
  };

  // Toggle Employee Safety Certification
  const toggleSafetyCert = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, hasSafetyCert: !e.hasSafetyCert } : e
      )
    );
  };

  // Add Invoice Log
  const addInvoice = (vendor: string, invoiceNumber: string, value: number, description: string) => {
    const newLog: InvoiceLog = {
      id: `inv-${Date.now()}`,
      vendor,
      invoiceNumber,
      value,
      description,
      date: new Date().toISOString().split("T")[0]
    };
    setInvoiceLogs((prev) => [newLog, ...prev]);
    
    // Simulate adding stock to items mentioned in description (simple mock update)
    if (description.toLowerCase().includes("serra") || description.toLowerCase().includes("ferramenta")) {
      setWarehouseItems(prev => 
        prev.map(item => item.id === "item-2" ? { ...item, stock: item.stock + 2 } : item)
      );
    }
  };

  // Update Stock levels
  const updateStock = (id: string, newStock: number) => {
    setWarehouseItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
    );
  };

  // ── Calculations for Overview KPIs ──
  const scheduledCount = events.reduce((acc, curr) => acc + curr.assignedEmployees.length, 0);
  const lowStockCount = warehouseItems.filter(item => item.stock < 5).length;
  
  // Pending documents from active / planned events
  const pendingDocsCount = events
    .filter(e => e.phase !== "post")
    .reduce((acc, curr) => acc + curr.docs.filter(d => d.status === "pending").length, 0);

  return (
    <div className="layout-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <span className="logo-text">Controll-All</span>
          <span className="logo-dot" style={{ fontSize: "20px", fontWeight: "900" }}>.</span>
        </div>

        <nav>
          <ul className="nav-list">
            <li>
              <button 
                className={`nav-link w-full ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={18} /> Visão Geral
              </button>
            </li>
            <li>
              <button 
                className={`nav-link w-full ${activeTab === "kanban" ? "active" : ""}`}
                onClick={() => setActiveTab("kanban")}
              >
                <Briefcase size={18} /> Eventos &amp; Quadros
              </button>
            </li>
            <li>
              <button 
                className={`nav-link w-full ${activeTab === "warehouse" ? "active" : ""}`}
                onClick={() => setActiveTab("warehouse")}
              >
                <Archive size={18} /> Depósito / Galpão
              </button>
            </li>
            <li>
              <button 
                className={`nav-link w-full ${activeTab === "employees" ? "active" : ""}`}
                onClick={() => setActiveTab("employees")}
              >
                <Users size={18} /> Colaboradores
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="user-footer">
          <div className="user-avatar">C</div>
          <div className="user-info">
            <span className="user-name">Claudia Lopes</span>
            <span className="user-role">Coordenadora</span>
          </div>
          <button 
            style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            onClick={() => alert("Logout realizado (Simulado)")}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <main className="main-area">
        {/* Header */}
        <header className="header">
          <h2 className="page-title">
            {activeTab === "overview" && "Visão Geral das Operações"}
            {activeTab === "kanban" && "Quadro de Projetos de Estandes"}
            {activeTab === "warehouse" && "Depósito, Estoque e Notas Fiscais"}
            {activeTab === "employees" && "Diretório de Profissionais"}
          </h2>
          <div className="header-actions">
            <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
              Status Operacional: <span style={{ color: "var(--success)" }}>Online</span>
            </span>
          </div>
        </header>

        {/* Content Wrapper */}
        <section className="content-wrapper">
          {activeTab === "overview" && (
            <Overview 
              events={events}
              employeesCount={scheduledCount}
              lowStockItemsCount={lowStockCount}
              pendingDocsCount={pendingDocsCount}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
            />
          )}

          {activeTab === "kanban" && (
            <KanbanBoards 
              events={events}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
              onAddEvent={addEvent}
              onUpdateEventPhase={updateEventPhase}
            />
          )}

          {activeTab === "warehouse" && (
            <Warehouse 
              warehouseItems={warehouseItems}
              invoiceLogs={invoiceLogs}
              onAddInvoice={addInvoice}
              onUpdateStock={updateStock}
            />
          )}

          {activeTab === "employees" && (
            <Employees 
              employees={employees}
              onAddEmployee={addEmployee}
              onToggleDocStatus={toggleDocStatus}
              onToggleSafetyCert={toggleSafetyCert}
            />
          )}
        </section>
      </main>

      {/* Event Details Overlay Modal (Universal modal) */}
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent}
          allEmployees={employees}
          allWarehouseItems={warehouseItems}
          onClose={() => setSelectedEvent(null)}
          onUpdateEvent={updateEventDetails}
        />
      )}
    </div>
  );
}
