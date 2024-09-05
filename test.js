const { handler } = require('./netlify/functions/send-discord-notification.js');

const event = {
  queryStringParameters: {
    status: 'initializing',
    messageId: null, // ou uma ID de mensagem válida, se estiver atualizando
  },
};

const context = {
  // contexto, se necessário
};

// Defina a URL do webhook diretamente, se não estiver configurada como variável de ambiente
process.env.DEV_NOTIFICATION

handler(event, context).then(response => {
  console.log('Response:', response);
}).catch(error => {
  console.error('Error:', error);
});
