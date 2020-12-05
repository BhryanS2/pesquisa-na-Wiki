const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
    maximumSentences: 12
  }

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  content.lang = askAndReturnLanguage()
  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('digite um termo de pesquisa do wikipedia: ')
  }

  function askAndReturnPrefix() {
    const prefixes = ['quem é', 'o que é', 'A história de']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

  function askAndReturnLanguage(){
    const language = ['pt','en']
    const selectedLangIndex = readline.keyInSelect(language,'Choice Language: ')
    const selectedLangText = language[selectedLangIndex]
    return selectedLangText
  }

  console.log(content)
}

module.exports = robot