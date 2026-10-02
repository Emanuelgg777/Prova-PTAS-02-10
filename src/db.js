import { readFile, writeFile } from 'node:fs/promises'

const caminho = 'src/data.json'

export async function ler() {
  try {
    const dados = await readFile(caminho, 'utf8')
    return JSON.parse(dados)
  } catch (erro) {
    if (erro.code === 'ENOENT') return []
    throw erro
  }
}

export async function salvar(lista) {
  await writeFile(caminho, JSON.stringify(lista, null, 2))
}