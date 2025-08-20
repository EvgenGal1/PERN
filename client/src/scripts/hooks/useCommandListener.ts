import { useEffect, useRef, useCallback } from "react";
import { CommandConfig } from "@/types/user.types";

interface UseCommandListenerOptions {
  /** масс.config кмд. */
  commands: CommandConfig[];
}

/**
 * Хук > отслеживания множества комбинаций клавиш.
 * Режим "зажатия в строгом порядке" (_H_S) из useAllKeysPress > 'sequence'/'simultaneous', 'touchpad' - заглушка
 *
 * Принцип работы (_H_S):
 * 1. При нажатии клавиши (keydown) она добавляется в список зажатых (keysHeldRef)
 *    и в историю порядка зажатия (keysClampedOrderRef).
 * 2. При отпускании любой клавиши (keyup) состояние сбрасывается.
 * 3. При каждом keydown проверяются все команды.
 * 4. Совпадение определяется как:
 *    - Все клавиши команды зажаты (keysHeldRef).
 *    - Последние N зажатых клавиш (keysClampedOrderRef) совпадают
 *      с клавишами команды в том же порядке.
 * 5. При совпадении вызывается onMatch() команды и состояние сбрасывается.
 */
export const useCommandListener = ({ commands }: UseCommandListenerOptions) => {
  /** множество зажатых клавиш */
  const keysHeldRef = useRef<Set<string>>(new Set());
  /** масс.порядок зажитых клавиш */
  const keysClampedOrderRef = useRef<string[]>([]);
  /** таймер автоочистки набора комбинации */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  /** флаг обработки Ю предотвращения множест.срабатываний */
  const isProcessingRef = useRef(false);

  /** сброса состояния */
  const resetState = useCallback(() => {
    keysHeldRef.current.clear();
    keysClampedOrderRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isProcessingRef.current = false;
  }, []);

  /** проверки совпадений зажатых клавиш с требуемой комбинацией клавиш */
  const checkHoldSequenceMatch = useCallback((targetCombination: string[]) => {
    const heldKeys = keysHeldRef.current;
    const targetKeys = new Set(targetCombination);

    // проверка кол-ва и наличия всех зажатых клвш.к комбинации
    if (
      targetKeys.size !== heldKeys.size ||
      !Array.from(targetKeys).every((k) => heldKeys.has(k))
    ) {
      return false;
    }

    // проверка последовательности зажатия (последние N). Масс.зажатых клвш.
    const clampedKeys = keysClampedOrderRef.current;
    // проверка длины зажатых к комбинации (больше для будущих комбин.)
    if (clampedKeys.length >= targetCombination.length) {
      // взять последние N зажатых клавиш. по длине комбинации
      const lastNClampedKeys = clampedKeys.slice(-targetCombination.length);
      // проверка совпадения N зажатых к инд.комбинации
      return lastNClampedKeys.every((key, i) => key === targetCombination[i]);
    }
    return false;
  }, []);

  /** обработка любых совпадений для разных типов */
  const processMatches = useCallback(() => {
    // защита от множественных вызовов и пустого списка команд
    if (isProcessingRef.current || commands.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    let anyMatched = false;

    // итерация по всем командам
    for (const command of commands) {
      // обраб.зажатие sequence/simultaneous
      if (command.type === "sequence" || command.type === "simultaneous") {
        if (checkHoldSequenceMatch(command.keys)) {
          // вызов обработчик команды
          command.onMatch();
          anyMatched = true;

          // сброс
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          // таймер от залипаний
          timeoutRef.current = setTimeout(resetState, 100);
          // прерыв после первого совпадения
          break;
        }
      } else if (command.type === "touchpad") {
        // заглушка для touchpad
        console.log(
          `[useCommandListener] Команда TouchPad '${command.name}' (заглушка).`
        );
      }
    }

    // сброс флага обработки е/и нет совпадений, иначе сброс по таймеру
    if (!anyMatched) isProcessingRef.current = false;
  }, [commands, checkHoldSequenceMatch, resetState]);

  // глобол.слушат.событ.клвш., обраб.нажатий/очистки
  useEffect(() => {
    /** обраб.нажатия клвш. Раб.брауз.при нажат.клвш. > регистр.и проверки совпадения */
    const handleKeyDown = (e: KeyboardEvent) => {
      // игнор событий без ключа и автоповтор
      if (!e.key || e.repeat) return;
      // клвш.в нижн.регистр
      const key = e.key.toLowerCase();
      // добав.клвш.в множество зажатых
      keysHeldRef.current.add(key);
      // запись порядка зажатий
      keysClampedOrderRef.current = [...keysClampedOrderRef.current, key];
      // очистка предыдущего таймера сброса при наличии
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // проверка совпадения зажатых с комбинацией ч/з доп.fn
      processMatches();
    };

    /** обраб.отпускания клвш. Раб.брауз.при отпуск.клвш. > удал.из сост.и сброса */
    const handleKeyUp = (e: KeyboardEvent) => {
      // игнор событий без ключа
      if (!e.key) return;
      const key = e.key.toLowerCase();
      // удал.клвш.из множества зажатых
      keysHeldRef.current.delete(key);
      // сброс комбинации при отпускании
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // мгновенный сброс
      resetState();
    };

    // регистр.слушат.событ. > добав.обраб.к объ.window
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // fn очистка usEf. Возврат fn > вызова при размонтир./измен.зависим.usEf
    return () => {
      // удал.обраб.событий
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // финальный сброс при размонтировании
      resetState();
    };
  }, [commands, processMatches, resetState]);

  // возврат resetState > сброса извне
  return { resetState };
};
