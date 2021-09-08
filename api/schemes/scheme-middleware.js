const Schemes = require('./scheme-model')

const checkSchemeId = async (req, res, next) => {
  try {
    const { scheme_id } = req.params
    const scheme = await Schemes.findById(scheme_id)
    if (scheme.scheme_name) {
      req.scheme = scheme
      next()
    } else {
      next({
        status: 404,
        message: `scheme with scheme_id ${scheme_id} not found`,
      })
    }
  } catch (err) {
    next(err)
  }
}

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body
  if (
    scheme_name === undefined ||
    scheme_name === '' ||
    typeof scheme_name !== 'string'
  ) {
    res.status(400).json({
      message: 'invalid scheme_name',
    })
  } else {
    next()
  }
}

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body
  if (
    instructions === undefined ||
    instructions === '' ||
    typeof instructions !== 'string'
  ) {
    res.status(400).json({
      message: 'invalid step',
    })
  } else if (isNaN(step_number) || step_number < 1) {
    res.status(400).json({
      message: 'invalid step',
    })
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
