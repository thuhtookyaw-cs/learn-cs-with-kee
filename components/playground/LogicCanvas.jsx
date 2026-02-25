'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ----------------------------------------------------------------------------
// CUSTOM NODES
// ----------------------------------------------------------------------------

// 1. INPUT NODE
const InputNode = ({ data, isConnectable }) => {
    return (
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-mono font-bold transition-all shadow-md ${data.value ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30' : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)]'}`}>
            <div className="absolute -top-6 text-xs font-sans text-[var(--text-muted)] tracking-wider">INPUT</div>
            {data.value ? '1' : '0'}
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-4 h-4 bg-emerald-500 border-2 border-[var(--bg)]" />
        </div>
    );
};

// 2. OUTPUT NODE
const OutputNode = ({ data, isConnectable }) => {
    return (
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-mono font-bold transition-all duration-300 shadow-lg ${data.value ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-none' : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text-muted)]'}`}>
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-4 h-4 bg-indigo-500 border-2 border-[var(--bg)]" />
            <div className="absolute -top-6 text-xs font-sans text-[var(--text-muted)] tracking-wider">OUTPUT</div>
            {data.value ? '1' : '0'}
        </div>
    );
};

const GateIcon = ({ type, className = "w-full h-full" }) => {
    const fill = "rgba(99, 102, 241, 0.15)";
    const stroke = "currentColor";
    const sw = 6;

    switch (type) {
        case 'AND':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 10 10 L 60 10 A 40 40 0 0 1 60 90 L 10 90 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                </svg>
            );
        case 'OR':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 10 10 C 50 10 75 25 100 50 C 75 75 50 90 10 90 C 30 60 30 40 10 10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                </svg>
            );
        case 'NOT':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 10 20 L 76 50 L 10 80 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                    <circle cx="88" cy="50" r="8" fill="var(--bg-card)" stroke={stroke} strokeWidth={sw} />
                </svg>
            );
        case 'NAND':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 10 10 L 42 10 A 40 40 0 0 1 42 90 L 10 90 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                    <circle cx="90" cy="50" r="8" fill="var(--bg-card)" stroke={stroke} strokeWidth={sw} />
                </svg>
            );
        case 'NOR':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 10 10 C 40 10 60 25 78 50 C 60 75 40 90 10 90 C 30 60 30 40 10 10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                    <circle cx="88" cy="50" r="8" fill="var(--bg-card)" stroke={stroke} strokeWidth={sw} />
                </svg>
            );
        case 'XOR':
            return (
                <svg className={className} viewBox="0 0 100 100">
                    <path d="M 5 10 C 25 40 25 60 5 90" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                    <path d="M 20 10 C 50 10 70 25 100 50 C 70 75 50 90 20 90 C 40 60 40 40 20 10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                </svg>
            );
        default:
            return null;
    }
};

// 3. GATE NODE
const GateNode = ({ data, isConnectable }) => {
    const isNot = data.type === 'NOT';
    return (
        <div className="flex items-center justify-center relative group transition-all" style={{ width: 80, height: 60 }}>
            {/* The SVG Graphic */}
            <GateIcon type={data.type} className="absolute inset-0 w-full h-full text-[var(--text)] drop-shadow-md" />

            {/* Type Label Below */}
            <div className="absolute -bottom-6 text-[10px] font-bold tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors uppercase select-none">{data.type}</div>

            {/* Targets (Inputs to the gate) */}
            {isNot ? (
                <Handle type="target" position={Position.Left} id="a" style={{ top: '50%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500 border-none transition-transform hover:scale-150" />
            ) : (
                <>
                    <Handle type="target" position={Position.Left} id="a" style={{ top: '25%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500 border-none transition-transform hover:scale-150" />
                    <Handle type="target" position={Position.Left} id="b" style={{ top: '75%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500 border-none transition-transform hover:scale-150" />
                </>
            )}

            {/* Source (Output from the gate) */}
            <Handle type="source" position={Position.Right} style={{ top: '50%', right: -2 }} isConnectable={isConnectable} className="w-3 h-3 bg-emerald-500 border-none transition-transform hover:scale-150" />
        </div>
    );
};

// ----------------------------------------------------------------------------
// LOGIC SIMULATOR MAIN ENGINE
// ----------------------------------------------------------------------------

const initialNodes = [
    { id: 'in1', type: 'inputNode', position: { x: 50, y: 100 }, data: { value: 1 } },
    { id: 'in2', type: 'inputNode', position: { x: 50, y: 250 }, data: { value: 0 } },
    { id: 'gate1', type: 'gateNode', position: { x: 250, y: 160 }, data: { type: 'AND' } },
    { id: 'out1', type: 'outputNode', position: { x: 500, y: 175 }, data: { value: 0 } },
];

const initialEdges = [
    { id: 'e1-1', source: 'in1', target: 'gate1', targetHandle: 'a', animated: true, style: { strokeWidth: 3, stroke: '#10B981' } },
    { id: 'e1-2', source: 'in2', target: 'gate1', targetHandle: 'b', animated: false, style: { strokeWidth: 3, stroke: '#3f3f46' } },
    { id: 'e1-3', source: 'gate1', target: 'out1', animated: false, style: { strokeWidth: 3, stroke: '#3f3f46' } },
];

export default function LogicCanvas() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const nodeTypes = useMemo(() => ({ inputNode: InputNode, outputNode: OutputNode, gateNode: GateNode }), []);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: false, style: { strokeWidth: 3, stroke: '#3f3f46' } }, eds)),
        []
    );

    // Re-evaluate logic circuit whenever nodes or edges change
    useEffect(() => {
        setNodes((nds) => {
            const nextNodes = [...nds];
            let changed = false;

            // Simple topological sort / evaluation approach
            // 1. Map all source values
            const sourceValues = {};
            nextNodes.forEach(n => {
                if (n.type === 'inputNode') {
                    sourceValues[`${n.id}-source`] = n.data.value; // inputs just output their value
                }
            });

            // We need to evaluate gates until they stabilize (max 10 iterations to prevent infinite loops)
            for (let i = 0; i < 10; i++) {
                let stabilized = true;

                // Evaluate Gates
                nextNodes.filter(n => n.type === 'gateNode').forEach(gate => {
                    // Find incoming edges
                    const inEdges = edges.filter(e => e.target === gate.id);
                    const edgeA = inEdges.find(e => e.targetHandle === 'a' || (!e.targetHandle && gate.data.type === 'NOT'));
                    const edgeB = inEdges.find(e => e.targetHandle === 'b');

                    const valA = edgeA ? (sourceValues[`${edgeA.source}-source`] || 0) : 0;
                    const valB = edgeB ? (sourceValues[`${edgeB.source}-source`] || 0) : 0;

                    let outVal = 0;
                    switch (gate.data.type) {
                        case 'AND': outVal = valA && valB; break;
                        case 'OR': outVal = valA || valB; break;
                        case 'NAND': outVal = !(valA && valB) ? 1 : 0; break;
                        case 'NOR': outVal = !(valA || valB) ? 1 : 0; break;
                        case 'XOR': outVal = valA !== valB ? 1 : 0; break;
                        case 'NOT': outVal = !valA ? 1 : 0; break;
                    }

                    if (sourceValues[`${gate.id}-source`] !== outVal) {
                        sourceValues[`${gate.id}-source`] = outVal;
                        stabilized = false;
                    }
                });

                if (stabilized) break;
            }

            // Update output nodes based on what feeds into them
            nextNodes.forEach(n => {
                if (n.type === 'outputNode') {
                    const inEdge = edges.find(e => e.target === n.id);
                    const inVal = inEdge ? (sourceValues[`${inEdge.source}-source`] || 0) : 0;
                    if (n.data.value !== inVal) {
                        n.data = { ...n.data, value: inVal };
                        changed = true;
                    }
                }
            });

            // Visual Edge Updating (Make them green and animated if carrying a 1)
            setEdges(eds => {
                let edgeChanged = false;
                const newEdges = eds.map(e => {
                    const val = sourceValues[`${e.source}-source`];
                    const isHigh = val === 1;
                    if (e.animated !== isHigh || e.style?.stroke !== (isHigh ? '#10B981' : '#3f3f46')) {
                        edgeChanged = true;
                        return {
                            ...e,
                            animated: isHigh,
                            style: { ...e.style, stroke: isHigh ? '#10B981' : '#3f3f46' }
                        };
                    }
                    return e;
                });
                return edgeChanged ? newEdges : eds;
            });

            return changed ? nextNodes : nds;
        });
    }, [edges, nodes.length, nodes.filter(n => n.type === 'inputNode').map(n => n.data.value).join(',')]);


    // Toggle inputs on node click
    const onNodeClick = (_, node) => {
        if (node.type === 'inputNode') {
            setNodes(nds => nds.map(n => {
                if (n.id === node.id) {
                    return { ...n, data: { ...n.data, value: n.data.value ? 0 : 1 } };
                }
                return n;
            }));
        }
    };


    // Side Panel Tools
    const addNode = (type, gateType = null) => {
        const newNode = {
            id: `node_${Date.now()}`,
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
            type: type,
            data: type === 'gateNode' ? { type: gateType } : { value: 0 }
        };
        setNodes(nds => [...nds, newNode]);
    };

    return (
        <div className="flex w-full h-full text-black">
            {/* Sidebar */}
            <div className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-6 flex flex-col gap-6 overflow-y-auto z-10">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text)] font-serif mb-2">Sim Tools</h2>
                    <p className="text-[var(--text-muted)] text-xs mb-4">Click to add parts. Drag gates, connect colored dots (black to blue) to build a circuit. Click Inputs to flip 0/1.</p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Terminals</h3>
                    <button onClick={() => addNode('inputNode')} className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-xl text-sm font-bold hover:border-emerald-500 transition-colors flex items-center justify-between">
                        Input (0/1) <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    </button>
                    <button onClick={() => addNode('outputNode')} className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-xl text-sm font-bold hover:border-indigo-500 transition-colors flex items-center justify-between">
                        Output Lamp <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-4 mb-2">Logic Gates</h3>
                    {['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'].map(g => (
                        <button key={g} onClick={() => addNode('gateNode', g)} className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-xl text-sm font-bold hover:border-indigo-500 transition-colors flex items-center justify-between group">
                            {g} Gate
                            <div className="w-8 h-6 text-[var(--text-muted)] group-hover:text-indigo-400 transition-colors">
                                <GateIcon type={g} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-[#0f0f11]" // explicit dark background for canvas
                >
                    <Background color="#27272a" gap={24} />
                    <Controls className="bg-[var(--bg-card)] border-[var(--border)] fill-[var(--text)] [&_button]:border-b-[var(--border)]" />
                </ReactFlow>
            </div>
        </div>
    );
}
