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
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ----------------------------------------------------------------------------
// CUSTOM NODES
// ----------------------------------------------------------------------------

// 1. INPUT NODE (Toggle Switch Style)
const InputNode = ({ data, isConnectable }) => {
    return (
        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-mono transition-all duration-200 cursor-pointer select-none ${data.value ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:border-emerald-500/50 hover:text-[var(--text)]'}`}>
            <div className="absolute -top-6 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">INPUT</div>
            {data.value ? '1' : '0'}
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-emerald-500 border-none right-[-6px] transition-transform hover:scale-150" />
        </div>
    );
};

// 2. OUTPUT NODE (Realistic Lightbulb)
const OutputNode = ({ data, isConnectable }) => {
    const isOn = data.value === 1;
    return (
        <div className="relative flex flex-col items-center justify-center w-16 h-24 group">
            {/* The Glass Bulb */}
            <div className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 z-20 flex items-center justify-center ${isOn ? 'bg-yellow-200/90 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.9),inset_0_0_15px_rgba(255,255,255,1)] scale-110' : 'bg-[#18181b]/80 border-[#3f3f46] shadow-inner backdrop-blur-sm'}`}>
                {/* Inner Filament */}
                <div className={`w-4 h-5 border-2 border-b-0 rounded-t-full transition-all duration-300 ${isOn ? 'border-amber-100 shadow-[0_0_8px_rgba(255,255,255,1)]' : 'border-[#52525b]'}`}></div>

                {/* Glow Core */}
                {isOn && <div className="absolute w-6 h-6 bg-white rounded-full opacity-80 blur-[4px]"></div>}
            </div>

            {/* The Bulb Base (Always visible, grey/metallic) */}
            <div className={`w-6 h-5 bg-gradient-to-b from-[#52525b] to-[#27272a] rounded-b-[4px] border border-[#3f3f46] border-t-0 z-10 transition-all -mt-1 flex flex-col items-center justify-start pt-1 ${isOn ? 'shadow-[0_4px_10px_rgba(250,204,21,0.2)]' : ''}`}>
                <div className="w-full h-px bg-[#71717a] opacity-50 mb-[2px]"></div>
                <div className="w-full h-px bg-[#71717a] opacity-50 mb-[2px]"></div>
                <div className="w-full h-px bg-[#71717a] opacity-50"></div>
            </div>

            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-500 border-none left-[-4px] top-[35%] transition-transform hover:scale-150 z-30" />
            <div className={`absolute -bottom-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${isOn ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-[var(--text-muted)]'}`}>
                {isOn ? 'ON' : 'OFF'}
            </div>
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
            {/* The SVG Graphic - Styled as a glowing neon module */}
            <div className={`absolute inset-0 transition-all duration-300 rounded-xl ${isNot ? 'bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30' : 'bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30'} group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-sm`} />
            <GateIcon type={data.type} className={`absolute inset-0 w-full h-full drop-shadow-md z-10 ${isNot ? 'text-red-400' : 'text-indigo-400'}`} />

            {/* Type Label Below */}
            <div className="absolute -bottom-6 text-[10px] font-bold tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors uppercase select-none">{data.type}</div>

            {/* Targets (Inputs to the gate) */}
            {isNot ? (
                <Handle type="target" position={Position.Left} id="a" style={{ top: '50%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-red-400 border-none transition-transform hover:scale-150 z-20" />
            ) : (
                <>
                    <Handle type="target" position={Position.Left} id="a" style={{ top: '25%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-400 border-none transition-transform hover:scale-150 z-20" />
                    <Handle type="target" position={Position.Left} id="b" style={{ top: '75%', left: 5 }} isConnectable={isConnectable} className="w-3 h-3 bg-indigo-400 border-none transition-transform hover:scale-150 z-20" />
                </>
            )}

            {/* Source (Output from the gate) */}
            <Handle type="source" position={Position.Right} style={{ top: '50%', right: -2 }} isConnectable={isConnectable} className="w-3 h-3 bg-emerald-400 border-none transition-transform hover:scale-150 z-20" />
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
    { id: 'e1-1', source: 'in1', target: 'gate1', targetHandle: 'a', animated: true, style: { strokeWidth: 4, stroke: '#10B981' } },
    { id: 'e1-2', source: 'in2', target: 'gate1', targetHandle: 'b', animated: false, style: { strokeWidth: 3, stroke: '#52525b' } },
    { id: 'e1-3', source: 'gate1', target: 'out1', animated: false, style: { strokeWidth: 3, stroke: '#52525b' } },
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
        (params) => setEdges((eds) => addEdge({ ...params, animated: false, style: { strokeWidth: 3, stroke: '#52525b' } }, eds)),
        []
    );

    // Re-evaluate logic circuit whenever nodes or edges change
    useEffect(() => {
        // Prevent infinite loops by only evaluating when actual structural changes or input toggles happen
        // We will do a full evaluation pass and only state-update if values actually changed
        let stateChanged = false;
        const sourceValues = {};

        // 1. Map Initial Inputs
        nodes.forEach(n => {
            if (n.type === 'inputNode') sourceValues[`${n.id}-source`] = n.data.value;
        });

        // 2. Evaluate Gates (up to 10 passes for complex feedback loops)
        for (let i = 0; i < 10; i++) {
            let stabilized = true;
            nodes.filter(n => n.type === 'gateNode').forEach(gate => {
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

        // 3. Update Node States
        setNodes(nds => {
            let ndsChanged = false;
            const updatedNodes = nds.map(n => {
                if (n.type === 'outputNode') {
                    const inEdge = edges.find(e => e.target === n.id);
                    const inVal = inEdge ? (sourceValues[`${inEdge.source}-source`] || 0) : 0;
                    if (n.data.value !== inVal) {
                        ndsChanged = true;
                        return { ...n, data: { ...n.data, value: inVal } };
                    }
                }
                return n;
            });
            return ndsChanged ? updatedNodes : nds;
        });

        // 4. Update Edge Visuals
        setEdges(eds => {
            let edsChanged = false;
            const updatedEdges = eds.map(e => {
                const val = sourceValues[`${e.source}-source`];
                const isHigh = val === 1;
                if (e.animated !== isHigh || e.style?.stroke !== (isHigh ? '#10B981' : '#52525b')) {
                    edsChanged = true;
                    return {
                        ...e,
                        animated: isHigh,
                        style: { ...e.style, strokeWidth: isHigh ? 4 : 3, stroke: isHigh ? '#10B981' : '#52525b' }
                    };
                }
                return e;
            });
            return edsChanged ? updatedEdges : eds;
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
            {/* Sidebar Toolbox */}
            <div className="w-72 bg-[#18181b] border-r border-[#27272a] p-6 flex flex-col gap-8 overflow-y-auto z-10 shadow-2xl relative">

                {/* Header */}
                <div className="border-b border-[#27272a] pb-4">
                    <h2 className="text-xl font-black text-white tracking-widest uppercase mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Toolbox
                    </h2>
                    <p className="text-[#a1a1aa] text-xs leading-relaxed">Drag components onto the grid. Connect colored dots to build logic. Click Inputs to toggle <span className="text-emerald-400 font-bold">ON/OFF</span>. Select & press Backspace to delete.</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => { setNodes([]); setEdges([]); }} className="flex-1 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-sm">
                        Clear
                    </button>
                    <button onClick={() => { setNodes(initialNodes); setEdges(initialEdges); }} className="flex-1 py-2.5 bg-[#27272a] text-white hover:bg-indigo-500 rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-sm">
                        Demo
                    </button>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-[#52525b] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-full h-px bg-[#27272a]"></span>
                        Terminals
                        <span className="w-full h-px bg-[#27272a]"></span>
                    </h3>
                    <button onClick={() => addNode('inputNode')} className="w-full px-4 py-3.5 bg-[#27272a] border border-[#3f3f46] text-white rounded-xl text-sm font-bold hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all flex items-center justify-between group">
                        Input Switch <span className="w-3 h-3 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </button>
                    <button onClick={() => addNode('outputNode')} className="w-full px-4 py-3.5 bg-[#27272a] border border-[#3f3f46] text-white rounded-xl text-sm font-bold hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] transition-all flex items-center justify-between group">
                        Output Bulb
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#a1a1aa] group-hover:text-yellow-400 group-hover:scale-110 transition-all drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-[#52525b] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-full h-px bg-[#27272a]"></span>
                        Logic Gates
                        <span className="w-full h-px bg-[#27272a]"></span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'].map(g => (
                            <button key={g} onClick={() => addNode('gateNode', g)} className="flex flex-col items-center justify-center p-3 bg-[#27272a] border border-[#3f3f46] text-white rounded-xl text-xs font-bold hover:border-indigo-400 hover:bg-[#313136] hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all group gap-2">
                                <div className="w-10 h-8 text-[#a1a1aa] group-hover:text-indigo-400 transition-colors">
                                    <GateIcon type={g} />
                                </div>
                                {g}
                            </button>
                        ))}
                    </div>
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
                    <Background color="#3f3f46" gap={16} variant={BackgroundVariant.Dots} size={1} />
                    <Controls className="bg-[var(--bg-card)] border-[var(--border)] fill-[var(--text)] [&_button]:border-b-[var(--border)] [&_button:hover]:bg-[var(--bg)]" />
                </ReactFlow>
            </div>
        </div>
    );
}
