-- вставки в табл.commands
INSERT INTO
  commands (
    name,
    description,
    key_combination,
    required_role,
    required_level,
    is_active,
    created_at,
    updated_at
  )
VALUES
  (
    'dov_menu_on',
    'Включение видимости дополнительного меню',
    '{"keys": ["d", "o", "p", "m", "n"], "type": "sequence"}',
    'USER',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'dov_menu_off',
    'Отключение видимости дополнительного меню',
    '{"keys": ["d", "m", "n"], "type": "sequence"}',
    'USER',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'bulk_edit_mode',
    'Включение режима массового редактирования',
    '{"keys": ["ctrl", "shift", "e"], "type": "simultaneous"}',
    'ADMIN',
    5,
    true,
    NOW(),
    NULL
  ),
  (
    'perf_panel_toggle',
    'Открытие панели производительности',
    '{"keys": ["ctrl", "alt", "p"], "type": "simultaneous"}',
    'ADMIN',
    3,
    true,
    NOW(),
    NULL
  ),
  (
    'exp_ui_toggle',
    'Переключение на экспериментальный интерфейс',
    '{"keys": ["shift", "x", "y"], "type": "sequence"}',
    'USER',
    10,
    true,
    NOW(),
    NULL
  ),
  (
    'admin_debug_mode',
    'Активация расширенных инструментов отладки для админов',
    '{"keys": ["ctrl", "shift", "d"], "type": "simultaneous"}',
    'ADMIN',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'quick_logout',
    'Быстрый выход из аккаунта',
    '{"keys": ["q", "q"], "type": "sequence"}',
    'USER',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'show_user_id',
    'Показать ID текущего пользователя (для отладки)',
    '{"keys": ["u", "i", "d"], "type": "sequence"}',
    'USER',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'toggle_theme_debug',
    'Переключение темы (для отладки)',
    '{"keys": ["t", "t"], "type": "sequence"}',
    'USER',
    1,
    true,
    NOW(),
    NULL
  ),
  (
    'secret_admin_panel',
    'Секретная Админ-панель (только для супер-админов)',
    '{"keys": ["s", "a", "p"], "type": "sequence"}',
    'ADMIN',
    10,
    true,
    NOW(),
    NULL
  ),
  (
    'admin_panel',
    'Переадресация на Админ-панель',
    '{"keys": ["a", "d", "p", "n"], "type": "sequence"}',
    'ADMIN',
    1,
    true,
    NOW(),
    NULL
  ) ON CONFLICT (name) DO NOTHING;

-- Избегаем дубликатов при повторном запуске