import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="bg-rose-50 border-2 border-red-300 rounded-xl p-6 max-w-xs w-full">
            <p className="font-black text-red-700 text-sm mb-1">
              {this.props.label ?? 'Something went wrong'}
            </p>
            <p className="text-[10px] text-red-500 font-semibold mb-4 font-mono break-all">
              {this.state.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="bg-black text-white px-4 py-2 rounded-lg font-black text-xs border-2 border-black hover:bg-[#9BE9FB] hover:text-black transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
