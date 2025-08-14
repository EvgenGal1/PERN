import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  /** масс.комбинации клвш. > нажатия */
  keyCombination: string[];
  /** режим последовательности. true (_S) - строгая проверка комбинации, false (_s) - любой порядок */
  sequenceCode?: boolean;
  /** режим удержания. true (_H) - зажатие/удержанией клвш., false (_h) - нажатие клвш. */
  holdMode?: boolean;
  /** ссылка > fn сброса из Родителя (при одноврем.отслеж.разн.комбинаций) */
  onResetRef?: React.MutableRefObject<(() => void) | null>;
}

/**
 * Хук для отслеживания нажатия комбинации клавиш.
 * @param options объ.с настр.: `keyCombination`, `sequenceCode`, `holdMode`, `onResetRef`
 * @returns true - комбинация успешно зажата/нажата, иначе false
 */
function useAllKeysPress({
  keyCombination,
  sequenceCode = true,
  holdMode = false,
  onResetRef,
}: Options): boolean {
  // возврат сост.`совпадения` нажатой комбинации
  const [matched, setMatched] = useState(false);
  /** ссы.на масс.нажатых клавиш > режима _h */
  const keysPressedRef = useRef<string[]>([]);
  /** ссы.на набор зажатых клавиши > режима _H */
  const keysHeldRef = useRef<Set<string>>(new Set());
  /** ссы.на масс.порядка зажитых клавиш > режима _H + _S */
  const keysClampedOrderRef = useRef<string[]>([]);
  // ссы.на таймер автоочистки набора комбинации
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // доп.fn > проверки совпадений зажатых/нажатых клавиш с требуемой комбинацией клавиш
  const checkMatch = useCallback(() => {
    // РЕЖИМ _H > _S_s
    if (holdMode) {
      // наборы зажатых/комбинаций клавиш
      const heldKeys = keysHeldRef.current;
      const targetKeys = new Set(keyCombination);

      // РЕЖИМ _H_S
      if (sequenceCode) {
        // проверка кол-ва и наличия всех зажатых клвш.к комбинации
        if (
          targetKeys.size !== heldKeys.size ||
          !Array.from(targetKeys).every((k) => heldKeys.has(k))
        ) {
          return false;
        }
        // масс. зажатых клвш.
        const сlampedKeys = keysClampedOrderRef.current;
        // проверка длины зажатых к комбинации (больше для будущих комбин.)
        if (сlampedKeys.length >= keyCombination.length) {
          // взять последние N зажатых клавиш. по длине комбинации
          const lastNClampedKeys = сlampedKeys.slice(-keyCombination.length);
          // проверка совпадения N зажатых к инд.комбинации
          return lastNClampedKeys.every((key, i) => key === keyCombination[i]);
        }
        return false;
      }
      // РЕЖИМ _H_s
      else {
        // проверка зажатых клвш.по кол-ву и наличию к комбинации
        return (
          targetKeys.size === heldKeys.size &&
          Array.from(targetKeys).every((k) => heldKeys.has(k))
        );
      }
    }
    // РЕЖИМ _h > _S_s
    else {
      // масс. нажатых клвш.
      const pressedSequence = keysPressedRef.current;

      // РЕЖИМ _h_S
      if (sequenceCode) {
        // проверка нажатых на длину и позиции к комбинации
        return (
          pressedSequence.length === keyCombination.length &&
          pressedSequence.every((key, index) => key === keyCombination[index])
        );
      }
      // РЕЖИМ _h_s
      else {
        // false при другой длине
        if (keysPressedRef.current.length !== keyCombination.length)
          return false;
        // проверка наличия нажатых в комбинации
        const targetSet = new Set(keyCombination);
        return pressedSequence.every((key) => targetSet.has(key));
      }
    }
  }, [keyCombination, sequenceCode, holdMode]);

  /** fn сброса сост.хука (масс./Set/сост./таймер) */
  const resetState = useCallback(() => {
    // очистка масс.нажатий, набора зажатий, порядка зажатий,
    keysPressedRef.current = [];
    keysHeldRef.current.clear();
    keysClampedOrderRef.current = [];
    // сброс сост.совпадений
    setMatched(false);
    // при запущенном таймере - остановка и обнул.ссы
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // передача fn сброса к Родителю ч/з ref
  useEffect(() => {
    // передача ссы.
    if (onResetRef) {
      // запись внутр.fn resetState в передан.ref
      onResetRef.current = resetState;
      // обнул.ref при размонтир./измен. resetState/onResetRef от утечки памяти
      return () => {
        if (onResetRef.current === resetState) {
          onResetRef.current = null;
        }
      };
    }
  }, [onResetRef, resetState]);

  // слушат.событ.клвш., обраб.нажатий/очистки
  useEffect(() => {
    // РЕЖИМ _H (зажатия клавиш)
    if (holdMode) {
      /** обраб.нажатия клвш. Раб.брауз.при нажат.клвш. > регистр.и проверки совпадения */
      const handleKeyDown = (e: KeyboardEvent) => {
        // игнор событий без ключа или повторяющиеся
        if (!e.key || e.repeat) return;
        // клвш.в нижн.регистр
        const key = e.key.toLowerCase();
        // добав.клвш.в список зажатых
        keysHeldRef.current.add(key);
        // запись порядка зажатий > _S
        keysClampedOrderRef.current = [...keysClampedOrderRef.current, key];
        // очистка таймера при наличии
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // проверка совпадения зажатых с комбинацией ч/з доп.fn
        if (checkMatch()) {
          // успех совпадения
          setMatched(true);
          // таймер от залипаний
          timeoutRef.current = setTimeout(resetState, 100);
        }
      };

      /** обраб.отпускания клвш. Раб.брауз.при отпуск.клвш. > удал.из сост.и сброса */
      const handleKeyUp = (e: KeyboardEvent) => {
        const releasedKey = e.key.toLowerCase();
        // удал.клвш.из списка зажатых
        keysHeldRef.current.delete(releasedKey);
        // проверка совпадения > строгого набора (без бействий), иначе сброс
        if (checkMatch()) {
        } else resetState();
        // мжн.остав.ток.сброс для жёсткого контроля отпусканий  >>  resetState();
      };

      // регистр.слушат.событ. > добав.обраб.к объ.window
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // очистка usEf. Возврат fn > вызова при размонтир./измен.зависим.usEf
      return () => {
        // удал.обраб.событий
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        // остан.таймер при наличии
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
    // РЕЖИМ _h (нажатия клавиш)
    else {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!e.key || e.repeat) return;
        // очистка пред.таймер
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // добав.нажат.клвш(ниж.регистр) в сост.
        // const key = e.key.toLowerCase();
        keysPressedRef.current = [
          ...keysPressedRef.current,
          e.key.toLowerCase(),
        ];

        // проверка совпадения комбинаций
        if (checkMatch()) {
          setMatched(true);
          // сброс с задержкой > реакции Комп.
          timeoutRef.current = setTimeout(resetState, 100);
          // прерывание от повторн.вкл.таймера автоочистки
          return;
        }

        // автоочистка сост. ч/з 1.5 сек.бездействия
        timeoutRef.current = setTimeout(() => {
          keysPressedRef.current = [];
        }, 1500);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [keyCombination, sequenceCode, holdMode, checkMatch, resetState]);

  // возврат текущее состояние совпадения
  return matched;
}

export default useAllKeysPress;
