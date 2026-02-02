import { useState } from 'react'

type ProjectStatus = 'running' | 'review' | 'paused' | 'error' | 'done'

interface Project {
  id: string
  name: string
  status: ProjectStatus
  lastAction: string
  nextStep: string
  port?: number
  diff?: string
  logs?: string
}

const statusConfig: Record<ProjectStatus, { emoji: string; color: string; label: string }> = {
  running: { emoji: '🟢', color: 'border-green-500', label: 'Running' },
  review: { emoji: '🟡', color: 'border-yellow-500', label: 'Needs Review' },
  paused: { emoji: '⏸️', color: 'border-gray-500', label: 'Paused' },
  error: { emoji: '🔴', color: 'border-red-500', label: 'Error' },
  done: { emoji: '✅', color: 'border-blue-500', label: 'Done' },
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Looomy',
    status: 'running',
    lastAction: 'Added YouTube chat integration',
    nextStep: 'Test with live stream',
    port: 3000,
  },
  {
    id: '2',
    name: 'Femora',
    status: 'review',
    lastAction: 'Fixed cycle prediction bug',
    nextStep: 'Deploy to production?',
    port: 3100,
    diff: '+15 -3 lines in prediction.ts',
  },
  {
    id: '3',
    name: 'DhanDiary',
    status: 'error',
    lastAction: 'Build failed',
    nextStep: 'Check TypeScript errors',
    port: 3200,
    logs: 'Type error: Property "amount" does not exist on type...',
  },
  {
    id: '4',
    name: 'AI Course',
    status: 'done',
    lastAction: 'Added Module 3 details',
    nextStep: 'Start Module 4?',
    port: 3300,
  },
]

function ProjectCard({ 
  project, 
  onApprove, 
  onReject, 
  onFocus,
  onUpdateStatus 
}: { 
  project: Project
  onApprove: () => void
  onReject: () => void
  onFocus: () => void
  onUpdateStatus: (status: ProjectStatus) => void
}) {
  const config = statusConfig[project.status]
  const [showLogs, setShowLogs] = useState(false)
  
  return (
    <div className={`bg-zinc-900 rounded-xl border-2 ${config.color} p-4 flex flex-col gap-3 min-w-[280px] transition-all hover:scale-[1.02]`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.emoji}</span>
          <h3 className="font-bold text-lg">{project.name}</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
          {config.label}
        </span>
      </div>
      
      {/* Port */}
      {project.port && (
        <div className="text-xs text-zinc-500">
          localhost:{project.port}
        </div>
      )}
      
      {/* Last Action */}
      <div>
        <div className="text-xs text-zinc-500 mb-1">Last:</div>
        <div className="text-sm text-zinc-300">{project.lastAction}</div>
      </div>
      
      {/* Next Step */}
      <div>
        <div className="text-xs text-zinc-500 mb-1">Next:</div>
        <div className="text-sm text-zinc-200 font-medium">{project.nextStep}</div>
      </div>
      
      {/* Diff */}
      {project.diff && (
        <div className="text-xs bg-zinc-800 rounded px-2 py-1 font-mono text-green-400">
          {project.diff}
        </div>
      )}
      
      {/* Logs */}
      {project.logs && (
        <div>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            {showLogs ? '▼ Hide Logs' : '▶ View Logs'}
          </button>
          {showLogs && (
            <div className="mt-2 text-xs bg-red-950 border border-red-900 rounded p-2 font-mono text-red-300 max-h-24 overflow-auto">
              {project.logs}
            </div>
          )}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        {project.status === 'review' && (
          <>
            <button 
              onClick={onApprove}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              ✓ Approve
            </button>
            <button 
              onClick={onReject}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              ✗ Reject
            </button>
          </>
        )}
        {project.status === 'running' && (
          <button 
            onClick={() => onUpdateStatus('paused')}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            ⏸ Pause
          </button>
        )}
        {project.status === 'paused' && (
          <button 
            onClick={() => onUpdateStatus('running')}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            ▶ Resume
          </button>
        )}
        {project.status === 'error' && (
          <button 
            onClick={() => onUpdateStatus('running')}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            🔄 Retry
          </button>
        )}
        {project.status === 'done' && (
          <button 
            onClick={() => onUpdateStatus('running')}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            ↺ Continue
          </button>
        )}
        <button 
          onClick={onFocus}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
          title="Focus this project"
        >
          🎯
        </button>
      </div>
    </div>
  )
}

function AddProjectModal({ onAdd, onClose }: { onAdd: (project: Omit<Project, 'id'>) => void, onClose: () => void }) {
  const [name, setName] = useState('')
  const [port, setPort] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name,
      status: 'paused',
      lastAction: 'Project created',
      nextStep: 'Start development',
      port: port ? parseInt(port) : undefined,
    })
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              placeholder="My Project"
              required
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Port (optional)</label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              placeholder="3000"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('agent-orchestra-projects')
    return saved ? JSON.parse(saved) : initialProjects
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [focusedProject, setFocusedProject] = useState<string | null>(null)

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects)
    localStorage.setItem('agent-orchestra-projects', JSON.stringify(newProjects))
  }

  const handleApprove = (id: string) => {
    saveProjects(projects.map(p => 
      p.id === id ? { ...p, status: 'running' as const, lastAction: 'Approved: ' + p.nextStep, nextStep: 'Continue...' } : p
    ))
  }

  const handleReject = (id: string) => {
    saveProjects(projects.map(p => 
      p.id === id ? { ...p, status: 'paused' as const, lastAction: 'Rejected, awaiting new direction' } : p
    ))
  }

  const handleFocus = (project: Project) => {
    setFocusedProject(project.id)
    // In a real app, this would trigger switching to the project's windows
    setTimeout(() => setFocusedProject(null), 1000)
  }

  const handleUpdateStatus = (id: string, status: ProjectStatus) => {
    saveProjects(projects.map(p => 
      p.id === id ? { ...p, status } : p
    ))
  }

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    }
    saveProjects([...projects, newProject])
  }

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      saveProjects(projects.filter(p => p.id !== id))
    }
  }

  const stats = {
    total: projects.length,
    running: projects.filter(p => p.status === 'running').length,
    review: projects.filter(p => p.status === 'review').length,
    error: projects.filter(p => p.status === 'error').length,
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦾</span>
            <h1 className="text-2xl font-bold">Agent Orchestra</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <span>+</span> Add Project
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="bg-zinc-900 rounded-lg px-4 py-2">
            <span className="text-zinc-500">Total:</span> <span className="font-bold">{stats.total}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg px-4 py-2">
            <span className="text-green-500">Running:</span> <span className="font-bold">{stats.running}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg px-4 py-2">
            <span className="text-yellow-500">Review:</span> <span className="font-bold">{stats.review}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg px-4 py-2">
            <span className="text-red-500">Errors:</span> <span className="font-bold">{stats.error}</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map(project => (
            <div key={project.id} className={`relative ${focusedProject === project.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950 rounded-xl' : ''}`}>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="absolute -top-2 -right-2 z-10 bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white w-6 h-6 rounded-full text-xs opacity-0 hover:opacity-100 transition-opacity"
                title="Delete project"
              >
                ×
              </button>
              <ProjectCard
                project={project}
                onApprove={() => handleApprove(project.id)}
                onReject={() => handleReject(project.id)}
                onFocus={() => handleFocus(project)}
                onUpdateStatus={(status) => handleUpdateStatus(project.id, status)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 text-xs text-zinc-600">
        Press 1-9 to quick-focus projects
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddProjectModal
          onAdd={handleAddProject}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default App
