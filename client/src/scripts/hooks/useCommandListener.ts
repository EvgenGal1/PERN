import { useEffect, useRef, useCallback } from "react";

import { commandBus } from "./commandBus";
import { AvailableCommands } from "@/types/user.types";
import { log } from "@/utils/logger";

interface UseCommandListenerOptions {
  /** масс.config кмд. */
  commands: AvailableCommands[];
}

/**
 * Хук > прослушки/отслеживания множества комбинаций клавиш, определения совпадений и вызов уведомл.подписчикам
 * Режим "зажатия в строгом порядке" (_H_S) из useAllKeysPress > 'sequence'/'simultaneous', 'touchpad' - заглушка
 *
 * Принцип работы (_H_S):
 * 1. При Монтировании добавляет глобальные слушатели событий 'keydown' и 'keyup'
 * 2. При Нажатии клавиши (keydown) она добавляется в множество зажатых `keysHeldRef`, в историю порядка зажатия `keysClampedOrderRef` и запуск проверки совпадений с любой кмд.
 * 3. При Отпускании клавиши (keyup) она удал.из множества `keysHeldRef` и очистка состояние/сброс таймера
 * 4. При Совпадение вызов `commandBus.emit(commandName)` > уведомления подписчиков и сброс состояние задержкой
 *
 * @param options объ.с парам.масс.кмд > отслеживания
 */
export const useCommandListener = ({ commands }: UseCommandListenerOptions) => {
  /** множество зажатых клавиш */
  const keysHeldRef = useRef<Set<string>>(new Set());
  /** масс.порядок зажитых клавиш */
  const keysClampedOrderRef = useRef<string[]>([]);
  /** таймер автоочистки набора комбинации */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  /** флаг обработки > предотвращения множест.срабатываний */
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

  /** обработка по списку любых совпадений разных типов > выдачи события ч/з commandBus */
  const processMatches = useCallback(() => {
    // защита от множественных вызовов и пустого списка команд
    if (isProcessingRef.current || commands.length === 0) return;
    // флаг обраб.от множ.вызывов
    isProcessingRef.current = true;
    // флаг отслеживания совпадения
    let anyMatched = false;

    // итерация по всем командам
    for (const command of commands) {
      // перем.совпадения
      let isMatch = false;
      // обраб.зажатие типов sequence/simultaneous
      if (command.type === "sequence" || command.type === "simultaneous") {
        if (checkHoldSequenceMatch(command.keys)) {
          // проверка совпадений
          isMatch = checkHoldSequenceMatch(command.keys);
        }
      } else if (command.type === "touchpad") {
        // заглушка для touchpad
        log(
          `[useCommandListener] Команда TouchPad '${command.name}' (заглушка).`
        );
      }

      // если совпало
      if (isMatch) {
        log(`[useCommandListener] Команда сработала: ${command.name}`);
        // оповещение подписчиков ч/з шину событий
        commandBus.emit(command.name);
        // отметка любого совпадения
        anyMatched = true;
        // сброс сост.ч/з короткий таймаут для предотвращения залипаний
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // таймер от залипаний
        timeoutRef.current = setTimeout(resetState, 100);
        // прерыв после первого совпадения
        break;
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
      // запуск проверки совпадения зажатых с комбинацией ч/з доп.fn
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

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
  }, [processMatches, resetState]);

  // возврат fn сброса > вызова извне
  return { resetState };
};
