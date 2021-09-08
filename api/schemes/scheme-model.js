const db = require('../../data/db-config')

function find() {
  const scheme = db('schemes as sc')
    .select('sc.*')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .count('st.step_id as number_of_steps', 'asc')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
  return scheme
}

async function findById(scheme_id) {
  const rows = await db('schemes as sc')
    .select('sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where({ 'sc.scheme_id': scheme_id })
    .orderBy('st.step_number')

  const steps = rows
    .filter((row) => row.step_id)
    .map(({ step_id, step_number, instructions }) => {
      return { step_id, step_number, instructions }
    })

  const final = {
    scheme_id: Number(scheme_id),
    scheme_name: rows.reduce((acc, curr) => {
      return curr.scheme_name
    }, null),
    steps,
  }
  return final
}

function findSteps(scheme_id) {
  const steps = db('steps as st')
    .leftJoin('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .where('st.scheme_id', scheme_id)
    .select('step_id', 'step_number', 'instructions', 'scheme_name')
    .orderBy('step_number')
  return steps
}

async function add(scheme) {
  const [id] = await db('schemes as sc').insert(scheme)
  const newScheme = await findById(id)
  return newScheme
}

function addStep(scheme_id, step) {
  return db('steps')
    .insert({
      ...step,
      scheme_id,
    })
    .then(() => {
      return db('steps as st')
        .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
        .select('step_id', 'step_number', 'instructions', 'scheme_name')
        .orderBy('step_number')
        .where('sc.scheme_id', scheme_id)
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
