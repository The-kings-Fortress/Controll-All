import { 
  Briefcase, Users, Archive, Calendar, 
  ArrowUpRight, AlertTriangle, TrendingUp, CheckCircle2 
} from "lucide-react";
import type { Project } from "../types";

interface OverviewProps {
  events: Project[];
  employeesCount: number;
  lowStockItemsCount: number;
  pendingDocsCount: number;
  onNavigateToTab: (tab: "overview" | "kanban" | "warehouse" | "employees") => void;
  onSelectEvent: (event: Project) => void;
}

export default function Overview({ 
  events, 
  employeesCount, 
  lowStockItemsCount, 
  pendingDocsCount,
  onNavigateToTab,
  onSelectEvent
}: OverviewProps) {
  
  // Calculate statistics
  const activeEventsCount = events.filter(e => e.phase === "during").length;
  
  // Sort events by date for upcoming events list
  const upcomingEvents = [...events]
    .filter(e => e.phase !== "post")
    .slice(0, 4);

  return (
    <div className="overview-container">
      {/* Metrics Grid */}
      <div className="overview-grid">
        <div className="metric-card" onClick={() => onNavigateToTab("kanban")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Eventos Ativos</span>
            <span className="metric-value">{activeEventsCount}</span>
            <span className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <TrendingUp size={12} style={{ color: "var(--success)" }} />
              De {events.length} totais
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--accent)" }}>
            <Briefcase size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigateToTab("employees")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Equipe Escalada</span>
            <span className="metric-value">{employeesCount}</span>
            <span className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
              Verificados no sistema
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--success)" }}>
            <Users size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigateToTab("warehouse")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Alertas do Depósito</span>
            <span className="metric-value" style={{ color: lowStockItemsCount > 0 ? "var(--warning)" : "var(--text-primary)" }}>
              {lowStockItemsCount}
            </span>
            <span className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <AlertTriangle size={12} style={{ color: lowStockItemsCount > 0 ? "var(--warning)" : "var(--success)" }} />
              Ferramentas em baixa
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: lowStockItemsCount > 0 ? "var(--warning-glow)" : "rgba(255, 255, 255, 0.05)", color: lowStockItemsCount > 0 ? "var(--warning)" : "var(--text-secondary)" }}>
            <Archive size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigateToTab("kanban")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Docs Pendentes</span>
            <span className="metric-value" style={{ color: pendingDocsCount > 0 ? "var(--danger)" : "var(--text-primary)" }}>
              {pendingDocsCount}
            </span>
            <span className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              Exigências da organização
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: pendingDocsCount > 0 ? "var(--danger-glow)" : "rgba(255, 255, 255, 0.05)", color: pendingDocsCount > 0 ? "var(--danger)" : "var(--text-secondary)" }}>
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Overview Sections Grid */}
      <div className="overview-sections-grid">
        {/* Left Section - Recent Events */}
        <div className="section-box">
          <div className="section-box-header">
            <h3 className="section-box-title">
              <Calendar size={16} style={{ color: "var(--accent)" }} />
              Próximas Montagens e Eventos
            </h3>
            <button className="btn-secondary text-xs" onClick={() => onNavigateToTab("kanban")} style={{ padding: "4px 8px" }}>
              Ver Todos
            </button>
          </div>
          
          <div className="event-feed-list">
            {upcomingEvents.length === 0 ? (
              <p className="text-muted text-sm" style={{ textAlign: "center", padding: "40px 0" }}>Nenhum evento agendado ou ativo.</p>
            ) : (
              upcomingEvents.map((event, i) => (
                <div 
                  key={event.id} 
                  className="event-feed-card"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="event-feed-info">
                    <div className={`event-feed-avatar color-${i % 4}`}>
                      {event.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="event-feed-meta">
                      <span className="event-feed-title">{event.name}</span>
                      <span className="event-feed-date">Cliente: {event.client} | Data: {event.startDate}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="flex-row gap-10">
                      <span className="text-xs text-muted">Progresso: {event.completionRate}%</span>
                      <div style={{ width: "60px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${event.completionRate}%`, height: "100%", background: event.completionRate === 100 ? "var(--success)" : "var(--accent)" }}></div>
                      </div>
                    </div>
                    <span className={`badge ${event.phase === "during" ? "badge-during" : "badge-no-event"}`} style={{ fontSize: "9px" }}>
                      {event.phase === "during" ? "Montando" : "Depósito"}
                    </span>
                    <ArrowUpRight size={14} className="text-muted" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Section - Daily Depot Info */}
        <div className="section-box">
          <div className="section-box-header">
            <h3 className="section-box-title">
              <Archive size={16} style={{ color: "var(--success)" }} />
              Quadro Diário: Depósito
            </h3>
            <button className="btn-secondary text-xs" onClick={() => onNavigateToTab("warehouse")} style={{ padding: "4px 8px" }}>
              Estoque
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
            <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border)" }}>
              <strong className="text-sm" style={{ display: "block", marginBottom: "4px" }}>Organização do Galpão</strong>
              <p className="text-xs text-muted">Dias comuns sem montagem ativa são dedicados à arrumação das prateleiras, manutenção de ferramentas elétricas e contagem de mobília.</p>
            </div>

            <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border)" }}>
              <strong className="text-sm" style={{ display: "block", marginBottom: "4px" }}>Bater Notas Fiscais</strong>
              <p className="text-xs text-muted">Confira as faturas e ordens de compra de madeira, lona e stands com os materiais físicos recebidos no depósito.</p>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "auto" }}>
              <span className="text-xs text-muted semibold" style={{ display: "block", marginBottom: "8px" }}>FERRAMENTAS EM ATENÇÃO:</span>
              {lowStockItemsCount > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)", fontSize: "12px" }}>
                  <AlertTriangle size={14} />
                  <span>Existem itens com quantidade crítica no galpão.</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "12px" }}>
                  <CheckCircle2 size={14} />
                  <span>Todas as ferramentas básicas estão abastecidas.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
