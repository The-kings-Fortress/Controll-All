import { useState, type FormEvent } from "react";
import { Plus, Users, Shield, ShieldAlert, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";
import type { Employee } from "../types";

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: (name: string, role: string, hasSafetyCert: boolean) => void;
  onToggleDocStatus: (id: string) => void;
  onToggleSafetyCert: (id: string) => void;
}

export default function Employees({
  employees,
  onAddEmployee,
  onToggleDocStatus,
  onToggleSafetyCert
}: EmployeesProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [hasSafetyCert, setHasSafetyCert] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    onAddEmployee(name, role, hasSafetyCert);
    
    setName("");
    setRole("");
    setHasSafetyCert(false);
    
    setSuccessMsg("Colaborador cadastrado com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
      {/* Left Column: Staff Directory List */}
      <div className="section-box" style={{ height: "auto" }}>
        <div className="section-box-header">
          <h3 className="section-box-title">
            <Users size={16} style={{ color: "var(--accent)" }} />
            Diretório de Colaboradores e Montadores
          </h3>
          <span className="kanban-column-count">{employees.length} cadastrados</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {employees.map((emp) => (
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

              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {/* Safety Certificate NR-35/NR-18 Toggle */}
                <div 
                  onClick={() => onToggleSafetyCert(emp.id)} 
                  className="pointer"
                  title="Clique para alterar certificação"
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
                >
                  {emp.hasSafetyCert ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--success)" }}>
                      <Shield size={14} />
                      <span className="semibold">NR-35 / NR-18 Ativa</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--danger)" }}>
                      <ShieldAlert size={14} />
                      <span className="semibold">NR Expirada / Nenhuma</span>
                    </div>
                  )}
                </div>

                {/* Personal Documents Status Toggle */}
                <div 
                  onClick={() => onToggleDocStatus(emp.id)}
                  className="pointer"
                  title="Clique para alterar status de documentos"
                  style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span className="status-dot" style={{ background: emp.documentStatus === "complete" ? "var(--success)" : "var(--warning)" }}></span>
                  <span className="text-muted">Docs: </span>
                  <strong style={{ color: emp.documentStatus === "complete" ? "var(--success)" : "var(--warning)" }}>
                    {emp.documentStatus === "complete" ? "Completos" : "Pendentes"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Register New Worker Form */}
      <div className="section-box" style={{ height: "fit-content" }}>
        <div className="section-box-header">
          <h3 className="section-box-title">
            <UserCheck size={16} style={{ color: "var(--accent)" }} />
            Cadastrar Novo Colaborador
          </h3>
        </div>

        {successMsg && (
          <div style={{ padding: "10px", borderRadius: "8px", background: "var(--success-glow)", border: "1px solid var(--success)", color: "var(--success)", fontSize: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome Completo</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: João Silva de Souza" 
              required
            />
          </div>
          <div className="field">
            <label>Função / Cargo</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="">Selecione a função...</option>
              <option value="Montador de Estande">Montador de Estande</option>
              <option value="Eletricista Operacional">Eletricista Operacional</option>
              <option value="Carpinteiro Montador">Carpinteiro Montador</option>
              <option value="Coordenador de Estande">Coordenador de Estande</option>
              <option value="Auxiliar Técnico">Auxiliar Técnico</option>
            </select>
          </div>
          
          <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px", marginTop: "12px" }}>
            <div 
              onClick={() => setHasSafetyCert(!hasSafetyCert)}
              className="pointer" 
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div className={`checkbox ${hasSafetyCert ? "checked" : ""}`}>
                {hasSafetyCert && "✓"}
              </div>
              <span className="semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                Possui Treinamento Ativo de NR-35 (Trabalho em Altura) / NR-18?
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-20" style={{ justifyContent: "center" }}>
            <Plus size={16} /> Cadastrar Colaborador
          </button>
        </form>

        <div style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "10px", background: "rgba(255, 255, 255, 0.01)", marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)", marginBottom: "4px" }}>
            <AlertTriangle size={14} />
            <strong className="text-xs uppercase">Aviso de Segurança (NR-35)</strong>
          </div>
          <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>
            Todo colaborador escalado para trabalhos em altura ou construção civil pesada precisa estar com a certificação NR ativa antes de ter a entrada liberada no pavilhão de eventos.
          </p>
        </div>
      </div>
    </div>
  );
}
