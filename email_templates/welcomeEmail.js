function welcomeEmailMessage(username) {
    const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Arravo Task Manager</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
              border-radius: 8px;
          }
          h1 {
              color: #333;
            //   text-align: center;

          }
          p {
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Welcome to our Finaki App, ${username} !</h1>
          <p> Easily track your income and expenses for financial success. </p>
          <p>Start managing your money effortlessly today!</p>
      </div>
  </body>
  </html>
  `;
  
    return template;
  }
  
  module.exports = { welcomeEmailMessage };
  