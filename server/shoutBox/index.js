const app = require('@live-change/framework').app()

const service = app.createServiceDefinition({
  name: 'shoutBox'
})

const Session = service.foreignModel('session', 'Session')

const Message = service.model({
  name: 'Message',
  properties: {
    text: {
      type: String,
      validation: ['nonEmpty']
    },
    timestamp: {
      type: Date,
      validation: ['nonEmpty']
    },
    session: {
      type: Session,
      validation: ['nonEmpty']
    }
  },
  indexes: {
    byTimestamp: {
      property: ['timestamp']
    }
  }
})

service.view({
  name: 'messagesByTimestamp',
  properties: {
    ...app.Range
  },
  async daoPath(parameters, { client, service }, method) {    
    const range = {
      ...parameters,
      limit: (parameters.limit && parameters.limit < 100) ? parameters.limit : 100
    }
    //console.log("MESSAGES RANGE", parameters, '=>', range)
    //const result = await Message.sortedIndexRangeGet('byTimestamp', range)
    //console.log("GOT MESSAGES", result.lenght)
    return Message.sortedIndexRangePath('byTimestamp', range)
  }
})

service.action({
  name: 'postMessage',
  properties: {
    text: Message.properties.text    
  },
  async execute({ text }, { client, service }, emit) {
    const id = app.generateUid()
    const timestamp = new Date()
    return await Message.create({ id, text, timestamp, session: client.session })
  }
})

module.exports = service
