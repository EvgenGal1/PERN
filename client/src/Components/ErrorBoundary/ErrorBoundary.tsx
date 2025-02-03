// ^ перехвата ошб.в дочер.Комп., предотвращает "падение" всего приложения. Показ резервный польз.интерфейс (fallback UI) и логировать ошб.

import React, { Component, ReactNode } from "react";
// import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: ReactNode; // вложен.дочер.Комп.
  //  передача отката UI
  fallback?: React.ReactElement<{ error: ErrorRes; onReset: () => void }>;
}

export interface ErrorRes {
  status?: number;
  message?: string;
  errors?: Record<string, unknown>;
  code?: string;
}

export type FallbackComp = React.ComponentType<{
  error: ErrorRes;
  onReset: () => void;
}>;

interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorRes | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComp?: FallbackComp;
}

// дефолтный UI для отображ./обраб.ошб.
const DefaultFallback = ({
  error,
  onReset,
}: {
  error: ErrorRes;
  onReset: () => void;
}) => (
  <div
    className="error-boundary"
    style={{ textAlign: "center", marginTop: "50px" }}
  >
    <h1>⚠️ Что-то пошло не так</h1>
    <p className="error-message">{error.message}</p>
    {error.code && <p className="error-code">Код: {error.code}</p>}
    <button className="retry-button" onClick={onReset}>
      Попробовать снова
    </button>
  </div>
);

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // перехват ошб.в дочер.Комп.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("ErrorBoundary ОШБ: ", error);
    // логгирование
    // Sentry.captureException(error);
    return {
      hasError: true,
      error: {
        status: 500,
        message: error.message,
        code: "COMPONENT_ERROR",
      },
    };
  }

  // логирование ошб. > аналитики
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Подробности ошибки:", error, errorInfo);
    // мжн.добав.интеграцию с Sentry > лог.ошб.
    // Sentry.captureException(error, { extra: errorInfo });
  }

  // сброс сост.после ошб.
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    // при ошб.отображ. переданный UI`резерв` или дефолтный
    if (this.state.hasError) {
      return this.props.FallbackComp ? (
        <this.props.FallbackComp
          error={this.state.error!}
          onReset={this.handleReset}
        />
      ) : (
        <DefaultFallback error={this.state.error!} onReset={this.handleReset} />
      );
    }
    // без ошб.отраж.дочер.эл.
    return this.props.children;
  }
}

export default ErrorBoundary;
