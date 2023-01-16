// конфиг.БД

// подкл.`общий фонд` из pg
const Pool = require("pg").Pool;

// созд.объ.кл.Pool для запросов к БД, куда передаём объ.для настр.
const pool = new Pool({
  // польз.подкл.к БД(postgres),пароль от СУБД,host,port по умолч при устан 5432,назв.БД
  user: "postgres",
  password: "Qaz123PoS!",
  // email: { type: String, required: true, unique: true },
  host: "localhost",
  port: "5432",
  database: "node_postgres",
});

// экспотр. объ.кл.
// module.exports = pool;

// ^ после UlbiTV.PERNstore
// подкл. ORM(связь прог.код с реляцион.БД)
const { Sequelize } = require("sequelize");

// экспотр. объ.кл. сразу с перем.окруж.
// module.exports = new Sequelize(
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

module.exports = { pool, sequelize };
