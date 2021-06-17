const app = require('@live-change/framework').app()
const session = require('@live-change/session-service')

const service = app.createServiceDefinition({
  name: 'sessionName',
  use: [ session ]
})

const Name = service.model({
  name: 'Name',
  sessionProperty: {
    readAccess: () => true,
    publicAccess: () => true
  },
  properties: {
    name: {
      type: String,
      validation: ['nonEmpty']
    }    
  }
})

service.action({
  name: 'setSessionName',
  properties: {
    ...Name.properties
  },
  async execute(properties, { client, service }, emit) {    
    const id = app.generateUid()    
    return await Name.create({ ...properties, id, session: client.session })
  }
})

service.action({
  name: 'resetSessionName',
  async execute(properties, { client, service }, emit) {
    const entity = await Name.indexObjectGet('bySession', client.session)
    await Name.delete(entity.id)
  }
})

module.exports = service
