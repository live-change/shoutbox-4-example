const app = require('@live-change/framework').app()
const session = require('@live-change/session-service')

const service = app.createServiceDefinition({
  name: 'sessionName',
  use: [ session ]
})

const Name = service.model({
  name: 'Name',
  sessionProperty: {
    sessionReadAccess: () => true,
    sessionWriteAccess: () => true,
    readAccess: () => true,
  },
  properties: {
    name: {
      type: String,
      validation: ['nonEmpty']
    }
  }
})

module.exports = service
