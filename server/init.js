const app = require('@live-change/framework').app()
const txtgen = require('txtgen')
const randomProfile = require('random-profile-generator')

const day = 24 * 60 * 60 * 1000

module.exports = async function(services) {

  console.log("initSCRIPT!")

  const sessions = []
  async function createRandomSession() {
    const session = app.generateUid()
    const name = randomProfile.profile().fullName
    await services.sessionName.models.Name.create({ id: session, session, name })
    sessions.push(session)
  }

  async function createRandomMessage() {
    const id = app.generateUid()
    const session = sessions[(Math.random() * sessions.length) | 0]
    await services.shoutBox.models.Message.create({
      id,
      session,
      timestamp: new Date( Date.now() - (Math.random()*day)|0),
      text: txtgen.sentence()
    })
  }

  for(let i = 0; i < 11; i++) await createRandomSession()
  for(let i = 0; i < 200; i++) await createRandomMessage()
}
