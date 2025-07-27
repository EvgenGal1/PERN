// ^ перехватчик ошб.рендера в дочер.Комп., отраж.резервн.UI(fallback) и логг.ошб.

import React, { Component, ReactNode } from "react";
// import * as Sentry from "@sentry/react";

// клс.обраб.ошб.
import { ApiError } from "@/utils/errorAPI";

// тип св-ва > резерв.UI Комп. {объ.ошб.в дочер.Комп., fn сброса сост./перезапуск прилож.}
export type FallbackCompProps = { error: ApiError; onReset: () => void };
// тапы св-ва/сост. Комп.`границы ошибок`
type ErrorBoundaryProps = {
  children: ReactNode /* вложен.дочер.Комп. > обёртки `границей ошибок` */;
  FallbackComp?: React.ComponentType<FallbackCompProps> /* Комп. > отраж.при ошб. user.Комп./DefaultFallback */;
};
type ErrorBoundaryState = { error: ApiError | null /* объ.ошб. е/и есть */ };

/**
 * @constant DefaultFallbackF
 * @description стандартый Комп.UI для отображ./обраб.ошб.
 * @param {FallbackCompProps} FallbackCompProps св-ва Комп.
 * @param {ApiError} props.error - объ.ошб. ошибки.
 * @param {Function} props.onReset - fn сброса сост.
 * @returns HTML разметку стандарт.ошб.
 */
const DefaultFallback: React.FC<FallbackCompProps> = ({ error, onReset }) => (
  <div
    className="error-boundary error-fallback"
    style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}
  >
    <h1>⚠️ Что-то пошло не так</h1>
    <p className="error-message">{error.message}</p>
    {process.env.NODE_ENV === "development" && error.code && (
      <p className="error-code">Код: {error.code}</p>
    )}
    <button
      className="retry-button"
      onClick={onReset}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Попробовать снова
    </button>
  </div>
);

/**
 * @class ErrorBoundary
 * @extends Component<ErrorBoundaryProps,ErrorBoundaryState>
 * @description Комп.`границы ошибок` > React от "падение" приложения при ошб.в дочер.Комп.
 *
 * @example
 * // использ.со стандарт.UI
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // использ.с пользовательским UI
 * const MyFallback = ({ error, onReset }) => (
 *   <div>
 *     <h2>Произошла ошибка!</h2>
 *     <p>{error.message}</p>
 *     <button onClick={onReset}>Перезагрузить</button>
 *   </div>
 * );
 *
 * <ErrorBoundary FallbackComp={MyFallback}>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // нач.сост.Комп.
  state: ErrorBoundaryState = { error: null };

  /**
   * @static
   * @method getDerivedStateFromError
   * @description статич.мтд.жизн.цикла. Вызов после ошб.в дочер.Комп. Возврат нов.сост.
   * @param {Error} error - ошб.из дочерр.Комп.
   * @returns {ErrorBoundaryState} нов.сост.Комп.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // логгирование/отправка ошб.в serv.аналитики (возможно Sentry)
    console.error("ErrorBoundary поймал ОШБ: ", error);
    // Sentry.captureException(error);
    // преобраз.ошб.в ApiError > унификации
    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, "REACT_COMPONENT_ERROR", undefined, {
            stack: error.stack,
          });

    return { error: apiError };
  }

  /**
   * @method componentDidCatch
   * @description мтд.жизн.цикла. Вызов после ошб. > логгов/аналитики ошб.
   * @param {Error} error - ошб.из дочерр.Комп.
   * @param {React.ErrorInfo} errorInfo - доп.инфо об ошб.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // логг./отправка доп.инфо.ошб.в serv.аналитики
    console.error("Подробности ошибки:", error, errorInfo);
    // Sentry.captureException(error, { extra: errorInfo });
  }

  /**
   * @method handleReset
   * @description обраб.сброса сост.ошб. Перезагруз стр.
   */
  handleReset = () => {
    this.setState({ error: null });
    // "мягкий" сброс сост.MobX/React - сброс всех Store/LS/State указ.кажд.отдел.
    // basketStore.reset();  >>  в кажд.Stroe + @action reset() {  this.products = [];  ...  this.clearLocalStorage()  }
    // userStore.reset();  this.setState({ error: null });  navigate(SHOP_ROUTE);
    // "жёсткий" сброс всего (просто/надёжность)
    window.location.reload();
  };

  // рендер пользователький/стандарт.Комп.
  render() {
    const { error } = this.state;
    const { FallbackComp, children } = this.props;

    // при ошб.отображ. пользователький/стандарт.Комп. UI
    if (error) {
      const FallbackComponent = FallbackComp || DefaultFallback;
      return <FallbackComponent error={error} onReset={this.handleReset} />;
    }
    // без ошб.отраж.дочер.эл.
    return children;
  }
}

export default ErrorBoundary;
