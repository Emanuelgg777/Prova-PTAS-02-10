import express from 'express'
import { ler, salvar } from './db.js'

const app = express()
app.use(express.json())

app.get('/emprestimos', async (req, res) => {
  const lista = await ler()
  res.json(lista.filter(e => e.devolvidoEm === null))
})

app.get('/emprestimos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const lista = await ler()
  const emp = lista.find(e => e.id === id)
  if (!emp) return res.status(404).json({ erro: 'Não encontrado' })
  res.json(emp)
})

app.post('/emprestimos', async (req, res) => {
  const { nomeAluno, livro } = req.body || {}
  if (!nomeAluno) return res.status(400).json({ erro: 'nomeAluno é obrigatório' })
  if (!livro) return res.status(400).json({ erro: 'livro é obrigatório' })

  const lista = await ler()
  const id = lista.length ? Math.max(...lista.map(e => e.id)) + 1 : 1
  const novo = { id, nomeAluno, livro, devolvidoEm: null }
  lista.push(novo)
  await salvar(lista)
  res.status(201).json(novo)
})

app.put('/emprestimos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { nomeAluno, livro } = req.body || {}
  if (!nomeAluno || !livro) {
    return res.status(400).json({ erro: 'nomeAluno e livro são obrigatórios' })
  }

  const lista = await ler()
  const i = lista.findIndex(e => e.id === id)
  if (i === -1) return res.status(404).json({ erro: 'Não encontrado' })

  lista[i] = { id, nomeAluno, livro, devolvidoEm: lista[i].devolvidoEm }
  await salvar(lista)
  res.json(lista[i])
})

app.patch('/emprestimos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const lista = await ler()
  const emp = lista.find(e => e.id === id)
  if (!emp) return res.status(404).json({ erro: 'Não encontrado' })

  const { id: _, devolvidoEm: __, ...dados } = req.body || {}
  Object.assign(emp, dados)
  await salvar(lista)
  res.json(emp)
})

app.delete('/emprestimos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const lista = await ler()
  const emp = lista.find(e => e.id === id)
  if (!emp) return res.status(404).json({ erro: 'Não encontrado' })
  if (emp.devolvidoEm) return res.status(409).json({ erro: 'Já devolvido' })

  emp.devolvidoEm = new Date().toISOString()
  await salvar(lista)
  res.status(204).end()
})

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'))