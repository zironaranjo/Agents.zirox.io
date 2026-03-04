"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type NodeProps,
  type Edge,
  type Node,
} from "@xyflow/react";
import type { Agent } from "@/lib/agents";

type AgentCanvasProps = {
  agents: Agent[];
};

type AgentNodeData = {
  label: string;
  detail: string;
  kind: "principal" | "subagente";
  tag: string;
};

function AgentNode({ data }: NodeProps<Node<AgentNodeData>>) {
  const isPrincipal = data.kind === "principal";

  return (
    <div
      className={`relative min-w-[220px] rounded-xl border p-3 shadow-[0_0_25px_rgba(16,185,129,0.08)] ${
        isPrincipal
          ? "border-emerald-400/45 bg-slate-900/95"
          : "border-cyan-400/40 bg-slate-900/90"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-none !bg-cyan-300"
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
          {data.kind}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] ${
            isPrincipal
              ? "border-emerald-300/40 text-emerald-200"
              : "border-cyan-300/40 text-cyan-200"
          }`}
        >
          {data.tag}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-100">{data.label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-300">{data.detail}</p>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-none !bg-emerald-300"
      />
    </div>
  );
}

export function AgentCanvas({ agents }: AgentCanvasProps) {
  const { nodes, edges } = useMemo(() => {
    const nextNodes: Node<AgentNodeData>[] = [];
    const nextEdges: Edge[] = [];

    const separacionVertical = 190;
    const inicioX = 80;
    const inicioY = 60;

    agents.forEach((agent, index) => {
      const agentY = inicioY + index * separacionVertical;

      nextNodes.push({
        id: agent.id,
        position: { x: inicioX, y: agentY },
        data: {
          label: agent.nombre,
          detail: agent.rol,
          kind: "principal",
          tag: "Agente",
        },
        type: "agentCard",
      });

      agent.subagentes.forEach((subagente, subIndex) => {
        const subId = `${agent.id}-${subagente.toLowerCase().replace(/\s+/g, "-")}`;

        nextNodes.push({
          id: subId,
          position: {
            x: inicioX + 350 + subIndex * 230,
            y: agentY,
          },
          data: {
            label: subagente,
            detail: `Subagente de ${agent.nombre}`,
            kind: "subagente",
            tag: "Worker",
          },
          type: "agentCard",
        });

        nextEdges.push({
          id: `edge-${agent.id}-${subId}`,
          source: agent.id,
          target: subId,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#22d3ee",
          },
          style: { stroke: "#22d3ee", strokeWidth: 1.6 },
        });
      });
    });

    return { nodes: nextNodes, edges: nextEdges };
  }, [agents]);

  return (
    <div className="workflow-surface h-[560px] w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ agentCard: AgentNode }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => (node.data?.kind === "principal" ? "#10b981" : "#22d3ee")}
          className="!bg-slate-900/95"
        />
        <Controls className="!border-slate-700 !bg-slate-900 !text-slate-100" />
        <Background color="#1f2937" gap={18} />
      </ReactFlow>
    </div>
  );
}
