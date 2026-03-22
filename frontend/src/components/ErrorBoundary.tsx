import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('UI ErrorBoundary caught an error:', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6 text-[#f5f5f5]">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
            <p className="mb-4 text-sm text-zinc-300">
              The chat UI encountered an unexpected error. Refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
