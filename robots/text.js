const algorithmia = require("algorithmia")
const algorithmiaApiKey = require('../credendials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credendials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
 
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

const state = require('./state.js')

async function robot() {
    const content = state.load()
    //passando para as funções os paramentros e vendo se elas são assincronas
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)

    //salvando o estado
    state.save(content)

    //função assincrona para buscar o conteúdo na wiki
    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticad = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticad.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            "lang" : content.lang,
            "articleName": content.searchTerm
        })
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
    }


    //função que limpa o conteudo da wiki
    function sanitizeContent(content){
        const withoutBlankLinesAndMarkdown = removeBlancklinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
        
        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlancklinesAndMarkdown(text){
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }
    //limpadno a marcação usada pela wiki
    function removeDatesInParentheses(text){
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

    //quebrando as senteças em palavras chves
    function breakContentIntoSentences(content) {
        content.sentences = []
    
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
          content.sentences.push({
            text: sentence,
            })
        })
    }

    //definindo o limite maximo de sentenças
    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }
    //buscando todas as palavras chaves na senteça
    async function fetchKeywordsOfAllSentences(content) {
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }
    //usando o watson para buscar as palavras chaves
    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            }
        }, (error, response) => {
            if (error) {
                reject(error)
                return
            }

            const keywords = response.keywords.map((keyword) => {
                return keyword.text
            })

            resolve(keywords)
            })
        })
    }
}

//esxportandno essa função
module.exports = robot