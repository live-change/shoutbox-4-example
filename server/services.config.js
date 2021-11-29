module.exports = {
  services: [
    {
      name: 'shoutBox',
      path: './shoutBox'
    }, {
      name: 'sessionName',
      path: './sessionName'
    }, {
      name: 'session',
      path: '@live-change/session-service',
      createSessionOnUpdate: true
    }
  ]
}
