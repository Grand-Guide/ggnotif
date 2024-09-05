const fetch = require('node-fetch');

async function sendOrUpdateWebhook(webhookUrl, messageId, status, color, description) {
  const body = JSON.stringify({
    embeds: [
      {
        title: 'Status do Deploy',
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
      },
    ],
  });

  try {
    const response = await fetch(messageId ? `${webhookUrl}/messages/${messageId}` : webhookUrl, {
      method: messageId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    // Checa o status da resposta
    if (response.status === 204) {
      // Nenhum corpo de resposta, mas a solicitação foi bem-sucedida
      return null;
    }

    // Se a resposta contiver um corpo, faz o parse
    const responseBody = await response.json();
    return responseBody.id;

  } catch (err) {
    console.error('Erro ao enviar notificação:', err);
  }
}

exports.handler = async function(event, context) {
  const webhookUrl = process.env.DEV_NOTIFICATION;
  const status = event.queryStringParameters.status;
  const messageId = event.queryStringParameters.messageId;

  let description;
  let color;

  switch (status) {
    case 'initializing':
      description = 'Deploy iniciado...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'building':
      description = 'Construindo o projeto...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'deploying':
      description = 'Enviando para produção...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'cleanup':
      description = 'Limpando...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'post-processing':
      description = 'Processamento final...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'success':
      description = 'Deploy concluído com sucesso!';
      color = 0x00FF00; // Verde
      break;
    case 'failure':
      description = 'Erro durante o deploy.';
      color = 0xFF0000; // Vermelho
      break;
    default:
      description = 'Status desconhecido.';
      color = 0xCCCCCC; // Cinza
  }

  const messageIdReturned = await sendOrUpdateWebhook(webhookUrl, messageId, status, color, description);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, messageId: messageIdReturned }),
  };
};
