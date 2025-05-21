// api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Configurar CORS para permitir acesso do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, SOAPAction'
  );

  // Responder imediatamente às requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Extrair o SOAPAction do cabeçalho da requisição
    const soapAction = req.headers.soapaction || '';
    
    // URL do webservice de destino
    const targetUrl = 'https://ws1.bmgconsig.com.br/webservices/SaqueComplementar';
    
    // Encaminhar a requisição para o webservice
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': soapAction
      },
      body: req.body
    });

    // Obter a resposta como texto
    const responseText = await response.text();
    
    // Retornar a resposta para o cliente
    res.status(response.status).send(responseText);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ error: 'Erro ao processar requisição', message: error.message });
  }
};
