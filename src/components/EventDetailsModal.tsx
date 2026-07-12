import { useState } from "react";
import { X, FileText, Shield, AlertCircle } from "lucide-react";
import type { Project, Employee, WarehouseItem } from "../types";

interface EventDetailsModalProps {
  event: Project;
  allEmployees: Employee[];
  allWarehouseItems: WarehouseItem[];
  onClose: () => void;
  onUpdateEvent: (updatedEvent: Project) => void;
}

export default function EventDetailsModal({
  event,
  allEmployees,
  allWarehouseItems,
  onClose,
  onUpdateEvent
}: EventDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"checklist" | "tools" | "staff" | "travel" | "docs">("checklist");
  
  // Local modifications state
  const [localEvent, setLocalEvent] = useState<Project>({ ...event });

  const handleUpdate = (updated: Project) => {
    setLocalEvent(updated);
    onUpdateEvent(updated);
  };

  // 1. Checklist Handlers
  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = localEvent.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    
    // Recalculate completion rate
    const total = updatedChecklist.length;
    const completed = updatedChecklist.filter(t => t.done).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    handleUpdate({
      ...localEvent,
      checklist: updatedChecklist,
      completionRate: rate
    });
  };

  // 2. Tool Allocation Handlers
  const handleToolQtyChange = (itemId: string, qty: number) => {
    const item = allWarehouseItems.find(w => w.id === itemId);
    if (!item) return;

    let updatedTools = [...localEvent.assignedTools];
    const existingIndex = updatedTools.findIndex(t => t.id === itemId);

    if (qty <= 0) {
      // Remove item
      updatedTools = updatedTools.filter(t => t.id !== itemId);
    } else {
      if (existingIndex > -1) {
        updatedTools[existingIndex] = { ...updatedTools[existingIndex], allocatedQty: qty };
      } else {
        updatedTools.push({
          id: item.id,
          name: item.name,
          type: item.type,
          allocatedQty: qty
        });
      }
    }

    handleUpdate({
      ...localEvent,
      assignedTools: updatedTools
    });
  };

  // 3. Staff Handlers
  const toggleEmployee = (empId: string) => {
    const isAssigned = localEvent.assignedEmployees.some(e => e.id === empId);
    let updatedStaff = [...localEvent.assignedEmployees];

    if (isAssigned) {
      updatedStaff = updatedStaff.filter(e => e.id !== empId);
    } else {
      const emp = allEmployees.find(e => e.id === empId);
      if (emp) {
        updatedStaff.push({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          documentStatus: emp.documentStatus
        });
      }
    }

    handleUpdate({
      ...localEvent,
      assignedEmployees: updatedStaff
    });
  };

  // 4. Travel Handlers
  const handleTravelChange = (field: "hotelName" | "hotelCheckin" | "flightDetails", value: string) => {
    handleUpdate({
      ...localEvent,
      [field]: value
    });
  };

  // 5. Document Handlers
  const simulateDocUpload = (docId: string) => {
    const updatedDocs = localEvent.docs.map((d) =>
      d.id === docId ? { ...d, status: d.status === "pending" ? "uploaded" as const : "approved" as const } : d
    );
    handleUpdate({
      ...localEvent,
      docs: updatedDocs
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <h3 className="modal-title">{localEvent.name}</h3>
            <span className="modal-subtitle">Cliente: {localEvent.client} | Data de Início: {localEvent.startDate}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === "checklist" ? "active" : ""}`}
            onClick={() => setActiveTab("checklist")}
          >
            Checklist
          </button>
          <button 
            className={`modal-tab ${activeTab === "tools" ? "active" : ""}`}
            onClick={() => setActiveTab("tools")}
          >
            Ferramentas e Móveis
          </button>
          <button 
            className={`modal-tab ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            Escala de Equipe
          </button>
          <button 
            className={`modal-tab ${activeTab === "travel" ? "active" : ""}`}
            onClick={() => setActiveTab("travel")}
          >
            Hospedagem &amp; Vôos
          </button>
          <button 
            className={`modal-tab ${activeTab === "docs" ? "active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Docs de Liberação
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* TAB 1: CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="checklist-container">
              <span className="text-xs text-muted semibold uppercase mb-20" style={{ display: "block" }}>
                Tarefas para Montagem do Stand ({localEvent.completionRate}% Concluído)
              </span>
              {localEvent.checklist.map((item) => (
                <div key={item.id} className="checklist-item">
                  <div className="checklist-item-left" onClick={() => toggleChecklistItem(item.id)}>
                    <div className={`checkbox ${item.done ? "checked" : ""}`}>
                      {item.done && "✓"}
                    </div>
                    <span className={`checklist-text ${item.done ? "checked" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TOOLS & FURNITURE */}
          {activeTab === "tools" && (
            <div>
              <span className="text-xs text-muted semibold uppercase mb-20" style={{ display: "block" }}>
                Planilha de Alocação de Materiais e Mobiliário
              </span>
              <table className="sheet-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Tipo</th>
                    <th>Estoque Geral</th>
                    <th style={{ width: "120px", textAlign: "center" }}>Alocado</th>
                  </tr>
                </thead>
                <tbody>
                  {allWarehouseItems.map((item) => {
                    const assigned = localEvent.assignedTools.find(t => t.id === item.id);
                    const currentQty = assigned ? assigned.allocatedQty : 0;
                    
                    return (
                      <tr key={item.id} className="sheet-row">
                        <td className="semibold">{item.name}</td>
                        <td>
                          <span className={`badge ${item.type === "tool" ? "badge-pt" : "badge-en"}`}>
                            {item.type === "tool" ? "Ferramenta" : "Móvel"}
                          </span>
                        </td>
                        <td className="text-muted">{item.stock} unidades</td>
                        <td style={{ textAlign: "center" }}>
                          <input 
                            type="number" 
                            min="0" 
                            max={item.stock}
                            value={currentQty} 
                            onChange={(e) => handleToolQtyChange(item.id, parseInt(e.target.value) || 0)}
                            className="input-qty"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: STAFF */}
          {activeTab === "staff" && (
            <div>
              <span className="text-xs text-muted semibold uppercase mb-20" style={{ display: "block" }}>
                Escalar Profissionais para Montagem / Coordenação
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {allEmployees.map((emp) => {
                  const isChecked = localEvent.assignedEmployees.some(e => e.id === emp.id);
                  return (
                    <div key={emp.id} className="staff-row">
                      <div className="staff-row-info">
                        <div className="staff-row-avatar">
                          {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-sm" style={{ display: "block" }}>{emp.name}</strong>
                          <span className="text-xs text-muted">{emp.role}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Safety certifications status */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                          {emp.hasSafetyCert ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--success)" }}>
                              <Shield size={12} />
                              <span>NR-35 / NR-18 Ativa</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--danger)" }}>
                              <AlertCircle size={12} />
                              <span>Sem Certificação</span>
                            </div>
                          )}
                        </div>

                        {/* Document completion status */}
                        <div style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                          <span className="status-dot" style={{ background: emp.documentStatus === "complete" ? "var(--success)" : "var(--warning)" }}></span>
                          <span className="text-muted">Docs {emp.documentStatus === "complete" ? "OK" : "Pendente"}</span>
                        </div>

                        {/* Assign switch button */}
                        <button 
                          className={isChecked ? "btn-danger text-xs" : "btn-primary text-xs"}
                          onClick={() => toggleEmployee(emp.id)}
                          style={{ padding: "4px 10px" }}
                        >
                          {isChecked ? "Remover" : "Escalar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TRAVEL */}
          {activeTab === "travel" && (
            <div className="form-grid">
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>Nome do Hotel / Acomodação</label>
                <input 
                  type="text" 
                  value={localEvent.hotelName || ""} 
                  onChange={(e) => handleTravelChange("hotelName", e.target.value)}
                  placeholder="Ex: Ibis Budget Center Paulista" 
                />
              </div>
              <div className="field">
                <label>Data de Check-In</label>
                <input 
                  type="date" 
                  value={localEvent.hotelCheckin || ""} 
                  onChange={(e) => handleTravelChange("hotelCheckin", e.target.value)}
                />
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>Detalhes das Passagens Aéreas (Vôos, Cias e Horários)</label>
                <textarea 
                  rows={4}
                  value={localEvent.flightDetails || ""} 
                  onChange={(e) => handleTravelChange("flightDetails", e.target.value)}
                  placeholder="Ex: Latam LA3341 (NAT -> GRU) - 22/08 às 14:00 - Localizadores: ADFLK, GDLJK..."
                />
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTATION */}
          {activeTab === "docs" && (
            <div>
              <span className="text-xs text-muted semibold uppercase mb-20" style={{ display: "block" }}>
                Documentos Exigidos pela Organização para Liberação da Montagem
              </span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {localEvent.docs.map((doc) => (
                  <div key={doc.id} className="checklist-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FileText size={16} className="text-muted" />
                      <strong className="text-sm">{doc.name}</strong>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span className="text-xs text-muted">
                        Status:{" "}
                        {doc.status === "pending" && <span style={{ color: "var(--warning)", fontWeight: 600 }}>Pendente</span>}
                        {doc.status === "uploaded" && <span style={{ color: "var(--accent)", fontWeight: 600 }}>Aguardando Avaliação</span>}
                        {doc.status === "approved" && <span style={{ color: "var(--success)", fontWeight: 600 }}>✓ Aprovado e Liberado</span>}
                      </span>
                      
                      <button 
                        className="btn-secondary text-xs"
                        style={{ padding: "4px 8px" }}
                        onClick={() => simulateDocUpload(doc.id)}
                      >
                        {doc.status === "pending" && "Subir Arquivo"}
                        {doc.status === "uploaded" && "Aprovar Doc"}
                        {doc.status === "approved" && "Reiniciar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="dropzone mt-20">
                <span className="text-xs" style={{ display: "block", marginBottom: "4px" }}>
                  Arraste outros documentos complementares aqui (ex: ART, RRT, Comprovante de taxas)
                </span>
                <span className="text-xs text-muted">Limite de 10MB por arquivo • Apenas PDF</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
