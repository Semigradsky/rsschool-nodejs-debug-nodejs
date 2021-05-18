import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  }
)

sequelize.authenticate().then(
  function success() {
    console.log("Connected to DB")
  },

  function fail(err) {
    console.log(`Error: ${err}`)
  }
)

export function importModel(Model) {
  return Model(sequelize, Sequelize)
}

export function sync() {
  // TODO: wtf
}
