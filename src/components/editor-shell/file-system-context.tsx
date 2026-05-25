import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PROJECT_FILES, DEFAULT_FILE_ID, fetchFileSource } from './file-system'
import type { ProjectFile } from './file-system'

interface FileSystemContextValue {
  files: ProjectFile[]
  activeFile: ProjectFile
  sources: Record<string, string>
  loading: boolean
  error: string | null
  selectFile: (file: ProjectFile) => void
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null)

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [activeFile, setActiveFile] = useState<ProjectFile>(
    PROJECT_FILES.find((f) => f.id === DEFAULT_FILE_ID) ?? PROJECT_FILES[0],
  )
  const [sources, setSources] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectFile = useCallback(
    async (file: ProjectFile) => {
      if (sources[file.id]) {
        setActiveFile(file)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const source = await fetchFileSource(file)
        setSources((prev) => ({ ...prev, [file.id]: source }))
        setActiveFile(file)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load file')
      } finally {
        setLoading(false)
      }
    },
    [sources],
  )

  // Load default file on mount
  useEffect(() => {
    selectFile(PROJECT_FILES.find((f) => f.id === DEFAULT_FILE_ID) ?? PROJECT_FILES[0])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FileSystemContext.Provider
      value={{ files: PROJECT_FILES, activeFile, sources, loading, error, selectFile }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const ctx = useContext(FileSystemContext)
  if (!ctx) throw new Error('useFileSystem must be used within FileSystemProvider')
  return ctx
}
