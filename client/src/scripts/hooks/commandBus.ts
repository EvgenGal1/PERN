// посредник (м/у слушат.событ и подписчиками)/шина событий > подписки/отписки/уведомлений в разных частях приложения

/** тип для функции-обработчика команды. Принимает имя сработавшей команды и доп.данные (для проброса) */
type CommandCallback = (commandName: string, data?: any) => void;

/** клс. CommandBus посредник/шина событий > слуш.событ.кмд. и подписчиками.
 * подписка на события (команды) и получение уведомлений при отрабатке.
 * посредник/связь м/у слушателем клавиш и обработчиками команд */
class CommandBus {
  /** масс.хран.всех зарег.обраб.кмд. */
  private listeners: CommandCallback[] = [];

  /** подписка на собитие (отраб.кмд.)
   * @param callback cb fn вызова при отраб.кмд
   * @returns fn отписки от событий */
  subscribe(callback: CommandCallback): () => void {
    // добав.нов.обраб.в список
    this.listeners.push(callback);
    // возврат fn отписки > удал.обраб.из списка
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  /** вызов уведомления (на события кмд.) всем зарег.обработ./подписчикам с передачей имени кмд. и доп.данные (проброс)
   * @param commandName имя сработавшей кмд.
   * @param data доп.данные (опционально) */
  emit(commandName: string, data?: any) {
    this.listeners.forEach((callback) => callback(commandName, data));
  }
}

/** посредник м/у слуш.событ.кмд. и подписчиками. экспорт один единственный экземпляр */
export const commandBus = new CommandBus();
