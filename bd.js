// конфиг.БД

// подкл.`общий фонд` из pg
const Pool = require("pg").Pool;
// созд.объ.кл.Pool для запросов к БД, куда передаём объ.для настр.
const pool = new Pool({
  // польз.подкл.к БД(postgres),пароль от СУБД,host,port по умолч при устан 5432,назв.БД
  user: "postgres",
  password: "Qaz123PoS!",
  host: "localhost",
  port: "5432",
  database: "node_postgres",
});

module.exports = pool;
