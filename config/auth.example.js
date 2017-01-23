module.exports = {

  'facebookAuth' : {
    'clientID'    : 'your-secret-clientID-here', 
    'clientSecret': 'your-client-secret-here', 
    'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'   : 'your-consumer-key-here',
    'consumerSecret': 'your-client-secret-here',
    'callbackURL'   : 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'    : 'your-secret-clientID-here',
    'clientSecret': 'your-client-secret-here',
    'callbackURL' : 'http://localhost:8080/auth/google/callback'
  }, 

  'githubAuth' : {
    'clientID': 'GITHUB_CLIENT_ID',
    'clientSecret': 'GITHUB_CLIENT_SECRET',
    'callbackURL': 'http://localhost:8080/auth/github/callback'
  }

};