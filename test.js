const http = require('http');

const data = JSON.stringify({
  table: 'pesadas',
  fecha: '2024/06/11',
  hora: '1:33',
  caravana: '123456',
  peso: '415.4'
  

});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/almacenar',  // Asegúrate de que la ruta sea correcta
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'mode': 'no-cors'
  }
};

const req = http.request(options, (res) => {
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseBody);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
