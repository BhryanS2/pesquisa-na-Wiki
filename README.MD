# Busca na Wiki
    Nesse projeto é usado o watson e o algorithmia para buscar conteúdo na wikipédia.
logo em seguida esse conteúdo é limpo e forma um `content.json` com as informações 

## Rodando na maquina local
Para rodar na máqiuna local crie uma pasta chamada `credentials` onde vai ficar sua chaves. Lá crie um `algorithmia.json` contendo lá sua chave guardada em `apiKey` e coloque lá sua chave.
    Depois vamos configurar o whatson
Para configutar ele crie um `watson-nlu.json`, contendo 

`{`
  "apikey": 
  "iam_apikey_description": 
  "iam_apikey_name":
  "iam_role_crn":
  "iam_serviceid_crn": 
`}`
## Dependencias
    Agora é isntalar as dependencias e ser feliz
São poucas dependencias basta usar `npm i algorithmia readline-sync sbd watson-developer-cloud`, apís isso digite no terminal `node index.js` e pesquise seu conteúdo



