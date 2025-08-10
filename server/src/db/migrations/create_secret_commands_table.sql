-- созд.табл.secret_commands. Не нужно т.к. авто.созд. ч/з await sequelize.sync({ alter: true })
CREATE TABLE IF NOT EXISTS secret_commands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  -- хранит { "keys": [...], "type": "sequence/simultaneous" }
  key_combination JSONB NOT NULL,
  -- название Роли
  required_role VARCHAR(255) NOT NULL,
  -- мин.Уровень Роли
  required_level INTEGER NOT NULL DEFAULT 1,
  -- флаг активности кмд.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL
);

-- коммент > док.(опционально)
COMMENT ON TABLE secret_commands IS 'Таблица для хранения определений секретных команд';

COMMENT ON COLUMN secret_commands.name IS 'Уникальное имя команды (например, dev_menu_toggle)';

COMMENT ON COLUMN secret_commands.key_combination IS 'JSON-объект, описывающий комбинацию клавиш';

COMMENT ON COLUMN secret_commands.required_role IS 'Роль, необходимая для активации команды';

COMMENT ON COLUMN secret_commands.required_level IS 'Минимальный уровень роли, необходимый для активации';

-- индексы > производительности
CREATE INDEX IF NOT EXISTS idx_secret_commands_active ON secret_commands(is_active);

CREATE INDEX IF NOT EXISTS idx_secret_commands_role_level ON secret_commands(required_role, required_level);