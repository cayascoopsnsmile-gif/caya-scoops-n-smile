import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("CSS Digital Hub render error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-white px-6 py-12 text-slate-900">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Startup error</p>
            <h1 className="mt-3 text-3xl font-semibold">The website hit an error while loading.</h1>
            <p className="mt-4 text-base text-slate-700">
              This screen is here so the app never fails silently again.
            </p>
            <pre className="mt-6 overflow-auto rounded-2xl bg-white p-4 text-sm text-slate-800">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
