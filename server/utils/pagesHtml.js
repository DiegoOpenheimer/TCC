const html404 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>404</title>
    <style>
        html, body {
            padding: 0;
            margin: 0
        }
        .container {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center
        }
        .container>h1 {
            font-size: 120px
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            404
        </h1>
    </div>
</body>
</html>`

const confirmAccount = link => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
            html, body {
                padding: 0;
                margin: 0;
            }
            .button {
                padding: 16px; background-color: blue; border-radius: 10px; border-color: blue; text-decoration: unset; color: #FFF
            }
        </style>
    </head>
    <body>
        <div>
            <h1>Confirmar criação de conta</h1>
            <a class="button" href="${link}">Confirmar</a>
        </div>
    </body>
    </html>`
}

module.exports = {
    html404,
    confirmAccount
}