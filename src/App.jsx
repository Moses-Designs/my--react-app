  import { useState, useRef, useEffect } from 'react'

// ── COLUMNS CONFIG ──────────────────────────────────────────
const COLUMNS = [
  {
    id: 'backlog',
    label: 'Backlog',
    icon: '🧠',
    accent: '#6366f1',
    accentBg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
  },
  {
    id: 'inprogress',
    label: 'In Progress',
    icon: '⚡',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    id: 'review',
    label: 'In Review',
    icon: '🔍',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
  },
  {
    id: 'solved',
    label: 'Solved',
    icon: '✅',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
  },
]

const PRIORITIES = [
  { id: 'critical', label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { id: 'high',     label: 'High',     color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { id: 'medium',   label: 'Medium',   color: '#eab308', bg: 'rgba(234,179,8,0.12)'  },
  { id: 'low',      label: 'Low',      color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
]

const INITIAL_TASKS = [
  { id: 1, text: 'Fix authentication bug in login flow', column: 'backlog',    priority: 'critical', tags: ['bug', 'auth'] },
  { id: 2, text: 'Redesign dashboard layout',           column: 'inprogress', priority: 'high',     tags: ['ui', 'design'] },
  { id: 3, text: 'Optimize database queries',            column: 'review',     priority: 'medium',   tags: ['backend', 'perf'] },
  { id: 4, text: 'Write unit tests for API endpoints',   column: 'solved',     priority: 'low',      tags: ['testing'] },
]

// ── HELPERS ─────────────────────────────────────────────────
const genId = () => Date.now() + Math.random()
const getPriority = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[2]
const getColumn   = (id) => COLUMNS.find(c => c.id === id)

// ── TASK CARD ────────────────────────────────────────────────
function TaskCard({ task, onDelete, onDragStart, isDragging }) {
  const priority = getPriority(task.priority)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isDragging
          ? 'rgba(255,255,255,0.03)'
          : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isDragging ? 'rgba(255,255,255,0.2)' : hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        padding: '14px 16px',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? 'rotate(2deg) scale(0.97)' : hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered && !isDragging ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Priority bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 3, height: '100%',
        background: priority.color,
        borderRadius: '10px 0 0 10px',
        opacity: 0.8,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingLeft: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: priority.color,
          background: priority.bg,
          padding: '2px 8px', borderRadius: 4,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          {priority.label}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: 'transparent', border: 'none',
            color: hovered ? '#ef4444' : 'rgba(255,255,255,0.2)',
            fontSize: 16, cursor: 'pointer', lineHeight: 1,
            transition: 'color 0.2s', padding: '0 2px',
          }}
        >×</button>
      </div>

      {/* Text */}
      <p style={{
        fontSize: 13.5, fontWeight: 500,
        color: 'rgba(240,244,255,0.88)',
        lineHeight: 1.5, marginBottom: 12,
        paddingLeft: 8,
      }}>
        {task.text}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 8 }}>
        {task.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2px 8px', borderRadius: 100,
            letterSpacing: 0.3,
          }}>#{tag}</span>
        ))}
      </div>

      {/* Drag handle hint */}
      <div style={{
        position: 'absolute', right: 10, bottom: 10,
        opacity: hovered ? 0.3 : 0,
        transition: 'opacity 0.2s',
        fontSize: 14,
      }}>⠿</div>
    </div>
  )
}

// ── COLUMN ────────────────────────────────────────────────────
function Column({ col, tasks, onDelete, onDragStart, onDrop, onDragOver, isDragOver }) {
  return (
    <div
      onDrop={(e) => onDrop(e, col.id)}
      onDragOver={onDragOver}
      style={{
        flex: 1, minWidth: 0,
        background: isDragOver ? col.accentBg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isDragOver ? col.border : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        padding: '16px 14px',
        transition: 'all 0.2s ease',
        boxShadow: isDragOver ? `0 0 0 2px ${col.accent}22, inset 0 0 40px ${col.accent}08` : 'none',
        minHeight: 400,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Column header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{col.icon}</span>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13, fontWeight: 700,
              color: 'rgba(240,244,255,0.7)',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>{col.label}</span>
          </div>
          <span style={{
            background: col.accentBg,
            border: `1px solid ${col.border}`,
            color: col.accent,
            fontSize: 11, fontWeight: 800,
            minWidth: 22, height: 22,
            borderRadius: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{tasks.length}</span>
        </div>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${col.accent}, transparent)`, borderRadius: 1, opacity: 0.5 }} />
      </div>

      {/* Drop zone indicator */}
      {isDragOver && (
        <div style={{
          border: `2px dashed ${col.border}`,
          borderRadius: 10, padding: 16,
          textAlign: 'center', marginBottom: 10,
          color: col.accent, fontSize: 12, fontWeight: 600,
          background: col.accentBg,
          animation: 'pulse 1s ease-in-out infinite',
        }}>
          Drop here
        </div>
      )}

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {tasks.length === 0 && !isDragOver && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.12)',
            fontSize: 12, gap: 8, padding: '20px 0',
          }}>
            <span style={{ fontSize: 28, opacity: 0.4 }}>{col.icon}</span>
            <span>No problems here</span>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onDragStart={onDragStart}
            isDragging={false}
          />
        ))}
      </div>
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [tasks,        setTasks]        = useState(INITIAL_TASKS)
  const [inputText,    setInputText]    = useState('')
  const [inputPriority,setInputPriority]= useState('medium')
  const [inputTag,     setInputTag]     = useState('')
  const [dragId,       setDragId]       = useState(null)
  const [dragOverCol,  setDragOverCol]  = useState(null)
  const [showForm,     setShowForm]     = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (showForm) inputRef.current?.focus()
  }, [showForm])

  // Stats
  const solved   = tasks.filter(t => t.column === 'solved').length
  const critical = tasks.filter(t => t.priority === 'critical').length
  const total    = tasks.length

  // Add task
  const addTask = () => {
    if (!inputText.trim()) return
    const tags = inputTag.trim()
      ? inputTag.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : ['task']
    setTasks(prev => [...prev, {
      id:       genId(),
      text:     inputText.trim(),
      column:   'backlog',
      priority: inputPriority,
      tags,
    }])
    setInputText('')
    setInputTag('')
    setShowForm(false)
  }

  // Delete
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  // Drag & Drop
  const handleDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const handleDrop = (e, colId) => {
    e.preventDefault()
    if (dragId == null) return
    setTasks(prev => prev.map(t => t.id === dragId ? { ...t, column: colId } : t))
    setDragId(null)
    setDragOverCol(null)
  }

  const selectedPriority = getPriority(inputPriority)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #080b14;
          font-family: 'DM Sans', sans-serif;
          color: #f0f4ff;
          min-height: 100vh;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        input:focus, textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12), transparent), #080b14',
        padding: '0 0 60px',
      }}>

        {/* ── HEADER ── */}
        <header style={{
          padding: '32px 40px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(8,11,20,0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>

              {/* Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>🧩</div>
                  <h1 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 22, fontWeight: 800,
                    background: 'linear-gradient(120deg, #f0f4ff 30%, #a5b4fc)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundSize: '200%',
                    animation: 'shimmer 4s linear infinite',
                  }}>TODO BOARD TRACKER</h1>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.3 }}>
                  Drag items across stages to track resolution
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'Total',    value: total,    color: '#6366f1' },
                  { label: 'Critical', value: critical, color: '#ef4444' },
                  { label: 'Solved',   value: solved,   color: '#10b981' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '10px 18px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => setShowForm(f => !f)}
                style={{
                  background: showForm
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: showForm ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13, fontWeight: 700,
                  padding: '11px 22px', borderRadius: 10,
                  cursor: 'pointer', letterSpacing: 0.5,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: showForm ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{showForm ? '✕' : '+'}</span>
                {showForm ? 'Cancel' : 'New Item'}
              </button>
            </div>

            {/* ── ADD FORM ── */}
            {showForm && (
              <div style={{
                marginTop: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: 20,
                animation: 'fadeSlideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: 10, alignItems: 'end',
              }}>
                <div>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                    Problem Description
                  </label>
                  <input
                    ref={inputRef}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask()}
                    placeholder="Describe the problem to solve..."
                    style={{
                      width: '100%', padding: '11px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f0f4ff',
                      fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                    Priority
                  </label>
                  <select
                    value={inputPriority}
                    onChange={e => setInputPriority(e.target.value)}
                    style={{
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: selectedPriority.color,
                      fontSize: 13, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      minWidth: 120,
                    }}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id} style={{ background: '#080b14', color: p.color }}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                    Tags (comma separated)
                  </label>
                  <input
                    value={inputTag}
                    onChange={e => setInputTag(e.target.value)}
                    placeholder="bug, frontend, ux"
                    style={{
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f0f4ff',
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      minWidth: 160,
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <button
                  onClick={addTask}
                  disabled={!inputText.trim()}
                  style={{
                    padding: '11px 24px',
                    background: inputText.trim()
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.05)',
                    border: 'none', borderRadius: 8,
                    color: inputText.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 13, fontWeight: 700,
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: inputText.trim() ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Add to Backlog →
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── BOARD ── */}
        <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px 0' }}>

          {/* Progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>
                Resolution Progress
              </span>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                {total > 0 ? Math.round((solved / total) * 100) : 0}% solved
              </span>
            </div>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.06)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${total > 0 ? (solved / total) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                borderRadius: 2,
                transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          </div>

          {/* Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}>
            {COLUMNS.map(col => (
              <Column
                key={col.id}
                col={col}
                tasks={tasks.filter(t => t.column === col.id)}
                onDelete={deleteTask}
                onDragStart={handleDragStart}
                onDragOver={(e) => { handleDragOver(e); setDragOverCol(col.id); }}
                onDrop={handleDrop}
                isDragOver={dragOverCol === col.id && dragId != null}
              />
            ))}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: 28, padding: '14px 20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1 }}>Priority:</span>
            {PRIORITIES.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{p.label}</span>
              </div>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              ✦ Drag cards between columns to update status
            </span>
          </div>
        </main>
      </div>
    </>
  )
}
